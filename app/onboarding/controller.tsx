import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { Routes } from "@/constants/Routes";
import { useFieldState } from "@/hooks/useFieldState";
import { getCurrentUser, updateDocument } from "@/services/appwrite";
import { router } from "expo-router";
import { pages } from "./component";

export interface OnboardingState {
  currentPage: number;
  ingredientAvoid: string[];
  diet: string[];
  region: string[];
  customSuggestions: string[][];
}

export const useOnboardingController = () => {
  const onboarding = useFieldState<OnboardingState>({
    currentPage: 1,
    ingredientAvoid: [],
    diet: [],
    region: [],
    customSuggestions: Array(pages.length).fill([]),
  });

  const {
    currentPage,
    customSuggestions,
    ingredientAvoid,
    diet,
    region,
    setFieldState,
  } = onboarding;

  const addCustomSuggestion = (pageIndex: number, suggestion: string) => {
    const updatedSuggestions = [...customSuggestions];
    const current = new Set(updatedSuggestions[pageIndex]);
    current.add(suggestion);
    updatedSuggestions[pageIndex] = Array.from(current);
    setFieldState("customSuggestions", updatedSuggestions);
  };

  const saveOnboardingData = async () => {
    try {
      const user = await getCurrentUser();
      await updateDocument(AppwriteConfig.USERS_COLLECTION_ID, user.$id, {
        avoid_ingredients: ingredientAvoid,
        diet,
        region_pref: region,
      });
    } catch (err) {
      console.error("Failed to save onboarding data:", err);
    }
  };

  const handleNext = async () => {
    const isFinalPage = currentPage === pages.length;

    if (isFinalPage) {
      await saveOnboardingData();
      router.replace(Routes.Home);
    } else {
      setFieldState("currentPage", currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setFieldState("currentPage", currentPage - 1);
    }
  };

  return {
    onboarding,
    handleNext,
    handlePrevious,
    addCustomSuggestion,
  };
};

export default useOnboardingController;
