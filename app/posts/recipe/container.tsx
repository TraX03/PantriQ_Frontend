import { useReduxSelectors } from "@/hooks/useReduxSelectors";
import { setLoading } from "@/redux/slices/loadingSlice";
import { AppDispatch } from "@/redux/store";
import { getCachedNutrition } from "@/utility/nutritionCacheUtils";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import RecipeComponent from "./component";
import useRecipeController from "./controller";

type Props = {
  recipeId: string;
};

export default function RecipeContainer({ recipeId }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { interactionMap, currentUserId } = useReduxSelectors();
  const { recipe, getRecipe, confirmDeleteRecipe, getNutritionEntry } =
    useRecipeController(interactionMap);

  useEffect(() => {
    const loadRecipe = async () => {
      dispatch(setLoading(true));
      try {
        await getRecipe(recipeId);
      } catch (error) {
        console.error("Failed to load recipe:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    loadRecipe();
  }, [recipeId]);

  useEffect(() => {
    if (!recipe.recipeData || recipe.nutritionData) return;

    const loadNutrition = async () => {
      const nutrition = await getCachedNutrition(recipe.recipeData!);
      recipe.setFieldState("nutritionData", nutrition);
    };

    loadNutrition();
  }, [recipe.recipeData, recipe.nutritionData]);

  return (
    <RecipeComponent
      recipe={recipe}
      handleDelete={confirmDeleteRecipe}
      getNutritionEntry={getNutritionEntry}
      currentUserId={currentUserId}
    />
  );
}
