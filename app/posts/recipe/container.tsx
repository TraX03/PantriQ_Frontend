import { setLoading } from "@/redux/slices/loadingSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { getCachedNutrition } from "@/utility/nutritionCacheUtils";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import RecipeComponent from "./component";
import useRecipeController from "./controller";

type Props = {
  recipeId: string;
};

export default function RecipeContainer({ recipeId }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { recipe, getRecipe, confirmDeleteRecipe, getNutritionEntry } =
    useRecipeController();

  const { userData: currentUserProfile } = useSelector(
    (state: RootState) => state.profile
  );
  const currentUserId = currentUserProfile?.id;

  useEffect(() => {
    const fetchRecipe = async () => {
      dispatch(setLoading(true));
      try {
        await getRecipe(recipeId);
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
      currentUserId={currentUserId}
    />
  );
}
