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
  const { recipe, getRecipe, confirmDeleteRecipe, getNutritionEntry } =
    useRecipeController();

  useEffect(() => {
    const fetchRecipe = async () => {
      dispatch(setLoading(true));
      try {
        const data = await getRecipe(recipeId);
        if (data) {
          recipe.setFields({
            recipeData: data.recipe,
            metadata: data.metadata,
          });
        }
      } catch (err) {
        console.error("Failed to load recipe:", err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchRecipe();
  }, [recipeId]);

  useEffect(() => {
    if (!recipe.recipeData || recipe.nutritionData) return;

    const fetchNutrition = async () => {
      const nutrition = await getCachedNutrition(recipe.recipeData!);
      recipe.setFieldState("nutritionData", nutrition);
    };

    fetchNutrition();
  }, [recipe.recipeData, recipe.nutritionData]);

  return (
    <RecipeComponent
      recipe={recipe}
      handleDelete={confirmDeleteRecipe}
      getNutritionEntry={getNutritionEntry}
    />
  );
}
