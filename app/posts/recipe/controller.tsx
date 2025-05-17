import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { databases } from "@/services/appwrite";
import { getUsersByIds } from "@/utility/userCacheUtils";
import { getImageUrl } from "@/utility/imageUtils";
import { useFieldState } from "@/hooks/useFieldState";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setLoading } from "@/redux/slices/loadingSlice";
import { detectBackgroundDarkness } from "@/utility/imageColorUtils";
import { Alert } from "react-native";
import { router } from "expo-router";
import { setRefreshProfile } from "@/redux/slices/profileSlice";

interface Recipe {
  id: string;
  title: string;
  author: string;
  images: string[];
  ingredients: string[];
  instructions: string;
  rating: number;
  commentCount: number;
}

export interface RecipeState {
  recipeData: Recipe | null;
  imageIndex: number;
  isBackgroundDark: boolean;
  showModal: boolean;
  fullscreenImage: string | null;
}

export const useRecipeController = () => {
  const dispatch = useDispatch<AppDispatch>();

  const recipe = useFieldState<RecipeState>({
    recipeData: null,
    imageIndex: 0,
    isBackgroundDark: false,
    showModal: false,
    fullscreenImage: null,
  });

  const getRecipeById = async (recipeId: string) => {
    try {
      const recipeResponse = await databases.getDocument(
        AppwriteConfig.DATABASE_ID,
        AppwriteConfig.RECIPES_COLLECTION_ID,
        recipeId
      );

      const authorId = recipeResponse.author_id;
      const usersMap = await getUsersByIds([authorId]);
      const author = usersMap.get(authorId);

      const images: string[] = Array.isArray(recipeResponse.image)
        ? recipeResponse.image.map((imgId: string) => getImageUrl(imgId))
        : [];

      return {
        id: recipeResponse.$id,
        title: recipeResponse.title,
        author: author?.name || "Unknown",
        images,
        ingredients: recipeResponse.ingredients,
        instructions: recipeResponse.instructions,
        rating: recipeResponse.rating ?? 0,
        commentCount: recipeResponse.commentCount ?? 0,
      };
    } catch (error) {
      console.error("Failed to fetch recipe or author:", error);
      throw error;
    }
  };

  const deleteRecipeById = async (recipeId: string) => {
    try {
      dispatch(setLoading(true));
      await databases.deleteDocument(
        AppwriteConfig.DATABASE_ID,
        AppwriteConfig.RECIPES_COLLECTION_ID,
        recipeId
      );

      recipe.setFieldState("recipeData", null);

      Alert.alert("Success", "Recipe deleted successfully.", [
        {
          text: "OK",
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      Alert.alert("Error", "Failed to delete the recipe. Please try again.");
      throw error;
    } finally {
      dispatch(setRefreshProfile(true));
      dispatch(setLoading(false));
    }
  };

  const updateBackgroundDarkness = (imageUrl: string) => {
    detectBackgroundDarkness(imageUrl)
      .then((isDark) => {
        recipe.setFieldState("isBackgroundDark", isDark);
      })
      .catch((err) => {
        console.warn("Error detecting image darkness:", err);
      });
  };

  return {
    recipe,
    getRecipeById,
    updateBackgroundDarkness,
    deleteRecipeById,
  };
};

export default useRecipeController;
