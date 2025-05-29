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
    const suggestionsSet = new Set(updatedSuggestions[pageIndex]);
    suggestionsSet.add(suggestion);
    updatedSuggestions[pageIndex] = Array.from(suggestionsSet);
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
    } catch (error) {
      console.error("Failed to save onboarding data:", error);
    }
  };

  const handleNext = async () => {
    if (currentPage === pages.length) {
      await saveOnboardingData();
      router.replace(Routes.Home);
    } else {
      setFieldState("currentPage", currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) setFieldState("currentPage", currentPage - 1);
  };

  const isNextEnabled = (() => {
    const selectedStates = [ingredientAvoid, diet, region];
    const selected = selectedStates[currentPage - 1];
    return Array.isArray(selected) ? selected.length > 0 : Boolean(selected);
  })();

  return {
    onboarding,
    handleNext,
    handlePrevious,
    addCustomSuggestion,
    isNextEnabled,
  };
};

export default useOnboardingController;
