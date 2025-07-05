import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { useFieldState } from "@/hooks/useFieldState";
import { fetchAllDocuments } from "@/services/Appwrite";
import { fetchUsers } from "@/utility/userCacheUtils";
import { Query } from "react-native-appwrite";

export type Review = {
  score: number;
  content: string;
  images: string[];
  username: string;
  avatarUrl: string | null;
  createdAt: string;
  userId: string;
};

export interface RecipeState {
  isInstructionsOverflow?: boolean;
  nutritionData?: any;
  expanded?: boolean;
  reviews?: Review[];
  fullscreenImage: string;
}

export const useRecipeController = () => {
  const recipe = useFieldState<RecipeState>({
    isInstructionsOverflow: false,
    nutritionData: null,
    expanded: false,
    fullscreenImage: "",
  });

  const { setFieldState } = recipe;

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

  const getRecipeRatings = async (recipeId: string) => {
    try {
      const [interactions, comments] = await Promise.all([
        fetchAllDocuments(AppwriteConfig.INTERACTIONS_COLLECTION_ID, [
          Query.equal("item_id", recipeId),
          Query.equal("type", "rating"),
        ]),
        fetchAllDocuments(AppwriteConfig.COMMENTS_COLLECTION_ID, [
          Query.equal("post_id", recipeId),
          Query.equal("is_review", true),
        ]),
      ]);

      const commentMap = new Map<string, any>();
      for (const comment of comments) {
        if (comment.rating_id) {
          commentMap.set(comment.rating_id, comment);
        }
      }

      const userIds = [...new Set(interactions.map((i: any) => i.user_id))];
      const users = await fetchUsers(userIds);

      const reviews = interactions.map((interaction: any) => {
        const comment = commentMap.get(interaction.$id);
        const user = users.get(interaction.user_id);

        return {
          score: interaction.score,
          createdAt: interaction.created_at,
          content: comment?.content ?? "",
          images: Array.isArray(comment?.images) ? comment.images : [],
          username: user?.username ?? "Unknown",
          avatarUrl: user?.avatarUrl ?? null,
          userId: interaction.user_id,
        };
      });

      setFieldState("reviews", reviews);
      return reviews;
    } catch (error) {
      console.error("Failed to fetch recipe ratings:", error);
      return [];
    }
  };

  return {
    recipe,
    getNutritionEntry,
    getRecipeRatings,
  };
};

export default useRecipeController;
