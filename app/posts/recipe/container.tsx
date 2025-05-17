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
  const { recipe, getRecipeById, updateBackgroundDarkness, deleteRecipeById } =
    useRecipeController();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        dispatch(setLoading(true));
        const data = await getRecipeById(recipeId);
        if (data) {
          recipe.setFieldState("recipeData", data);
        } else {
          console.warn("Recipe not found");
        }
      } catch (error) {
        console.error("Error loading recipe:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadRecipe();
  }, [recipeId]);

  useEffect(() => {
    if (recipe.recipeData?.images?.length) {
      const firstImage = recipe.recipeData.images[0];
      updateBackgroundDarkness(firstImage);
    }
  }, [recipe.recipeData?.images]);

  useEffect(() => {
    const currentImage = recipe.recipeData?.images?.[recipe.imageIndex];
    if (currentImage) updateBackgroundDarkness(currentImage);
  }, [recipe.imageIndex]);

  return (
    <RecipeComponent recipe={recipe} deleteRecipeById={deleteRecipeById} />
  );
}
