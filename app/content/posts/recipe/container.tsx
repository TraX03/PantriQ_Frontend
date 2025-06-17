import { useFieldState } from "@/hooks/useFieldState";
import { getCachedNutrition } from "@/utility/nutritionCacheUtils";
import { useEffect } from "react";
import { PostState, RecipePost } from "../controller";
import RecipeComponent from "./component";
import useRecipeController from "./controller";

type Props = {
  post: ReturnType<typeof useFieldState<PostState>>;
};

export default function RecipeContainer({ post }: Props) {
  const { recipe, getNutritionEntry } = useRecipeController();
  const recipeData = post.postData as RecipePost;

  useEffect(() => {
    if (!post.postData || recipe.nutritionData) return;

    const loadNutrition = async () => {
      const nutrition = await getCachedNutrition(recipeData);
      recipe.setFieldState("nutritionData", nutrition);
    };

    loadNutrition();
  }, [post.postData, recipe.nutritionData]);

  return (
    <RecipeComponent
      post={post}
      recipe={recipe}
      recipeData={recipeData}
      getNutritionEntry={getNutritionEntry}
    />
  );
}
