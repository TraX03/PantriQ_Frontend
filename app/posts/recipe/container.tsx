import { useDispatch } from "react-redux";
import RecipeComponent from "./component";
import useRecipeController from "./controller";
import { AppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { setLoading } from "@/redux/slices/loadingSlice";

type Props = {
  recipeId: string;
};

export default function RecipeContainer({ recipeId }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { recipe, getRecipeById, deleteRecipeById, toggleInteraction } =
    useRecipeController();

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        dispatch(setLoading(true));
        const data = await getRecipeById(recipeId);
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
      deleteRecipeById={deleteRecipeById}
      toggleInteraction={toggleInteraction}
    />
  );
}
