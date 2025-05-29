import { setLoading } from "@/redux/slices/loadingSlice";
import { AppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import RecipeComponent from "./component";
import useRecipeController from "./controller";

type Props = {
  recipeId: string;
};

export default function RecipeContainer({ recipeId }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { recipe, getRecipe, confirmDeleteRecipe } = useRecipeController();

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        dispatch(setLoading(true));
        const data = await getRecipe(recipeId);
        recipe.setFields({
          recipeData: data.recipe,
          metadata: data.metadata,
        });
      } catch (error) {
        console.error("Error loading recipe:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadRecipe();
  }, [recipeId]);

  return (
    <RecipeComponent
      recipe={recipe}
      handleDelete={confirmDeleteRecipe}
    />
  );
}
