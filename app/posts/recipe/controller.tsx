import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { useFieldState } from "@/hooks/useFieldState";
import { setLoading } from "@/redux/slices/loadingSlice";
import { setRefreshProfile } from "@/redux/slices/profileSlice";
import { AppDispatch } from "@/redux/store";
import {
  createDocument,
  deleteDocument,
  getCurrentUser,
  getDocumentById,
  listDocuments,
  storage,
} from "@/services/appwrite";
import { getImageUrl, isValidUrl } from "@/utility/imageUtils";
import { parseMetadata } from "@/utility/metadataUtils";
import { fetchUsers } from "@/utility/userCacheUtils";
import { router } from "expo-router";
import { Alert } from "react-native";
import { Query } from "react-native-appwrite";
import { useDispatch } from "react-redux";

export interface Recipe {
  id: string;
  title: string;
  author: string;
  images: string[];
  ingredients: string[];
  instructions: string[];
  rating: number;
  commentCount: number;
  category?: string[];
}

export interface RecipeState {
  recipeData: Recipe | null;
  imageIndex: number;
  showModal: boolean;
  fullscreenImage: string | null;
  metadata: any;
  isLiked: boolean;
  isBookmarked: boolean;
  likeDocId?: string;
  bookmarkDocId?: string;
  showStepsModal: boolean;
  isInstructionsOverflow: boolean;
}

export const useRecipeController = () => {
  const dispatch = useDispatch<AppDispatch>();

  const recipe = useFieldState<RecipeState>({
    recipeData: null,
    imageIndex: 0,
    showModal: false,
    fullscreenImage: null,
    metadata: null,
    isLiked: false,
    isBookmarked: false,
    likeDocId: undefined,
    bookmarkDocId: undefined,
    showStepsModal: false,
    isInstructionsOverflow: false,
  });

  const getRecipe = async (recipeId: string) => {
    try {
      const recipeDoc = await getDocumentById(
        AppwriteConfig.RECIPES_COLLECTION_ID,
        recipeId
      );
      const authorId = recipeDoc.author_id;
      const usersMap = await fetchUsers([authorId]);
      const author = usersMap.get(authorId);

      const images = Array.isArray(recipeDoc.image)
        ? recipeDoc.image.map(getImageUrl)
        : [];

      const metadata = parseMetadata(recipeDoc.metadata);

      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          const interactions = await listDocuments(
            AppwriteConfig.INTERACTIONS_COLLECTION_ID,
            [
              Query.equal("post_id", recipeDoc.$id),
              Query.equal("user_id", currentUser.$id),
            ]
          );

          const like = interactions.find((doc) => doc.type === "like");
          const bookmark = interactions.find((doc) => doc.type === "bookmark");

          recipe.setFields({
            isLiked: !!like,
            likeDocId: like?.$id,
            isBookmarked: !!bookmark,
            bookmarkDocId: bookmark?.$id,
          });
        }
      } catch (err) {
        console.warn("Skipping interactions: user not authenticated.");
      }

      return {
        recipe: {
          id: recipeDoc.$id,
          title: recipeDoc.title,
          author: author?.name || "Unknown",
          images,
          ingredients: recipeDoc.ingredients,
          instructions: recipeDoc.instructions,
          rating: recipeDoc.rating ?? 0,
          commentCount: recipeDoc.commentCount ?? 0,
        },
        metadata,
      };
    } catch (error) {
      console.error("Failed to fetch recipe or author:", error);
      throw error;
    }
  };

  const deleteRecipe = async (recipeId: string) => {
    try {
      dispatch(setLoading(true));

      const recipeDoc = await getDocumentById(
        AppwriteConfig.RECIPES_COLLECTION_ID,
        recipeId
      );
      const imageRefs = recipeDoc.image || [];
      const instructionRefs = recipeDoc.instructions || [];

      const extractDeletableFileIds = (refs: string[]) =>
        refs
          .map((item) => item.split(" - ")[0].trim())
          .filter((id) => !!id && !isValidUrl(id));

      const fileIds = [
        ...extractDeletableFileIds(imageRefs),
        ...extractDeletableFileIds(instructionRefs),
      ];

      await Promise.all(
        fileIds.map(async (fileId) => {
          try {
            await storage.deleteFile(AppwriteConfig.BUCKET_ID, fileId);
          } catch (err) {
            console.warn(`Failed to delete file ${fileId}:`, err);
          }
        })
      );

      await deleteDocument(AppwriteConfig.RECIPES_COLLECTION_ID, recipeId);

      recipe.setFieldState("recipeData", null);

      Alert.alert("Success", "Recipe deleted successfully.", [
        { text: "OK", onPress: () => router.back() },
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

  const toggleInteraction = async (type: "like" | "bookmark") => {
    const isActive = type === "like" ? recipe.isLiked : recipe.isBookmarked;
    const docId = type === "like" ? recipe.likeDocId : recipe.bookmarkDocId;
    const currentUser = await getCurrentUser();

    try {
      if (isActive && docId) {
        await deleteDocument(AppwriteConfig.INTERACTIONS_COLLECTION_ID, docId);

        recipe.setFields({
          [type === "like" ? "isLiked" : "isBookmarked"]: false,
          [type === "like" ? "likeDocId" : "bookmarkDocId"]: undefined,
        });
      } else {
        const newDoc = await createDocument(
          AppwriteConfig.INTERACTIONS_COLLECTION_ID,
          {
            user_id: currentUser.$id,
            post_id: recipe.recipeData?.id,
            type,
            created_at: new Date().toISOString(),
          }
        );

        recipe.setFields({
          [type === "like" ? "isLiked" : "isBookmarked"]: true,
          [type === "like" ? "likeDocId" : "bookmarkDocId"]: newDoc.$id,
        });
      }
    } catch (error) {
      console.warn("Interaction toggle failed:", error);
    }
  };

  return {
    recipe,
    getRecipe,
    deleteRecipe,
    toggleInteraction,
  };
};

export default useRecipeController;
