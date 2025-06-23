import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { Routes } from "@/constants/Routes";
import { useFieldState } from "@/hooks/useFieldState";
import { getCurrentUser, updateDocument } from "@/services/Appwrite";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { pages } from "./component";

export interface OnboardingState {
  currentPage: number;
  ingredientAvoid: string[];
  diet: string[];
  region: string[];
  customSuggestions: string[][];
  showSearchModal: boolean;
}

const fieldKeys: (keyof OnboardingState)[] = [
  "ingredientAvoid",
  "diet",
  "region",
];

export const useOnboardingController = () => {
  const onboarding = useFieldState<OnboardingState>({
    currentPage: 1,
    ingredientAvoid: [],
    diet: [],
    region: [],
    customSuggestions: Array(pages.length).fill([]),
    showSearchModal: false,
  });

  const {
    currentPage,
    ingredientAvoid,
    diet,
    region,
    customSuggestions,
    setFieldState,
  } = onboarding;

  const selectedStates = [ingredientAvoid, diet, region];
  const pageIndex = currentPage - 1;
  const currentField = fieldKeys[pageIndex];
  const selectedItems = selectedStates[pageIndex];

  const normalize = (text: string) => text.toLowerCase();
  const allSuggestions = [
    ...pages[pageIndex].suggestions,
    ...customSuggestions[pageIndex],
  ].map(normalize);

  const handleSelectItem = (item: string) => {
    const itemNormalized = normalize(item);
    const isNew = !allSuggestions.includes(itemNormalized);
    const isSelected = selectedItems.map(normalize).includes(itemNormalized);

    if (isNew) addCustomSuggestion(pageIndex, item);

    if (!isSelected) {
      setFieldState(currentField, [...selectedItems, item]);
    } else {
      Toast.show({ type: "info", text1: `"${item}" is already selected` });
    }

    setFieldState("showSearchModal", false);
  };

  const toggleItemSelection = (item: string) => {
    const updated = selectedItems.includes(item)
      ? selectedItems.filter((i) => i !== item)
      : [...selectedItems, item];

    setFieldState(currentField, updated);
  };

  const getPageSuggestions = () => [
    ...new Set([
      ...pages[pageIndex].suggestions,
      ...customSuggestions[pageIndex],
    ]),
  ];

  const addCustomSuggestion = (page: number, suggestion: string) => {
    const updated = [...customSuggestions];
    updated[page] = [...new Set([...updated[page], suggestion])];
    setFieldState("customSuggestions", updated);
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

  const isNextEnabled = selectedItems.length > 0;

  return {
    onboarding,
    isNextEnabled,
    actions: {
      handleNext,
      handlePrevious,
      handleSelectItem,
      toggleItemSelection,
      getPageSuggestions,
    },
  };
};

export default useOnboardingController;
