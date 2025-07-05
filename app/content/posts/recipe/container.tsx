import { useFieldState } from "@/hooks/useFieldState";
import { useReduxSelectors } from "@/hooks/useReduxSelectors";
import { getCachedNutrition } from "@/utility/nutritionCacheUtils";
import { useEffect } from "react";
import { PostState, RecipePost } from "../controller";
import RecipeComponent from "./component";
import useRecipeController from "./controller";

type Props = {
  post: ReturnType<typeof useFieldState<PostState>>;
};

export default function RecipeContainer({ post }: Props) {
  const { recipe, getNutritionEntry, getRecipeRatings } = useRecipeController();
  const { currentUserId } = useReduxSelectors();
  const recipeData = post.postData as RecipePost;

  useEffect(() => {
    if (!post.postData) return;

    const loadData = async () => {
      await getRecipeRatings(recipeData.id);

      if (!recipe.nutritionData) {
        const nutrition = await getCachedNutrition(recipeData);
        recipe.setFieldState("nutritionData", nutrition);
      }
    };

    loadData();
  }, [post.postData]);

  return (
    <RecipeComponent
      post={post}
      recipe={recipe}
      recipeData={recipeData}
      getNutritionEntry={getNutritionEntry}
      currentUserId={currentUserId}
    />
  );
}
