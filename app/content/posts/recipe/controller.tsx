import { useFieldState } from "@/hooks/useFieldState";

export interface RecipeState {
  isInstructionsOverflow?: boolean;
  nutritionData?: any;
  expanded?: boolean;
}

export const useRecipeController = () => {
  const recipe = useFieldState<RecipeState>({
    isInstructionsOverflow: false,
    nutritionData: null,
    expanded: false,
  });

  const getNutritionEntry = (
    data: any,
    key: "nutrients" | "properties",
    name: string
  ): { amount: number; unit: string } => {
    const found = data?.nutrition?.[key]?.find(
      (item: any) => item.name === name
    );
    return {
      amount: found?.amount ?? 0,
      unit: found?.unit ?? "",
    };
  };

  return {
    recipe,
    getNutritionEntry,
  };
};

export default useRecipeController;
