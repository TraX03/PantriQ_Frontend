import { Ingredient, Instruction } from "@/app/create/createForm/controller";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { useFieldState } from "@/hooks/useFieldState";
import { setLoading } from "@/redux/slices/loadingSlice";
import { setRefreshProfile } from "@/redux/slices/profileSlice";
import { AppDispatch } from "@/redux/store";
import {
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
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";

export interface Recipe {
  id: string;
  title: string;
  author: string;
  authorId: string;
  images: string[];
  ingredients: Ingredient[];
  instructions: Instruction[];
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
  nutritionData: any;
  expanded: boolean;
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
    nutritionData: null,
    expanded: false,
  });

  const { setFields, setFieldState } = recipe;

  const getRecipe = async (recipeId: string) => {
    try {
      const recipeDoc = await getDocumentById(
        AppwriteConfig.RECIPES_COLLECTION_ID,
        recipeId
      );

      const [usersMap, currentUser] = await Promise.all([
        fetchUsers([recipeDoc.author_id]),
        getCurrentUser().catch(() => null),
      ]);

      const author = usersMap.get(recipeDoc.author_id);
      const images = Array.isArray(recipeDoc.image)
        ? recipeDoc.image.map(getImageUrl)
        : [];

      const metadata = parseMetadata(recipeDoc.metadata);

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

        setFields({
          isLiked: !!like,
          likeDocId: like?.$id,
          isBookmarked: !!bookmark,
          bookmarkDocId: bookmark?.$id,
        });
      }

      return {
        recipe: {
          id: recipeDoc.$id,
          title: recipeDoc.title,
          author: author?.name || "Unknown",
          authorId: recipeDoc.author_id,
          images,
          ingredients: Array.isArray(recipeDoc.ingredients)
            ? recipeDoc.ingredients.map((item) => {
                try {
                  const parsed = JSON.parse(item);
                  return {
                    name: parsed.name,
                    quantity: parsed.quantity,
                  };
                } catch {
                  return { name: "", quantity: "" };
                }
              })
            : [],
          instructions: Array.isArray(recipeDoc.instructions)
            ? recipeDoc.instructions.map((item) => {
                try {
                  const parsed = JSON.parse(item);
                  return {
                    text: parsed.text,
                    image: parsed.image
                      ? isValidUrl(parsed.image)
                        ? parsed.image
                        : getImageUrl(parsed.image)
                      : undefined,
                  };
                } catch {
                  return { text: "", image: undefined };
                }
              })
            : [],
          rating: recipeDoc.rating ?? 0,
          commentCount: recipeDoc.commentCount ?? 0,
        },
        metadata,
      };
    } catch (error) {
      console.error("Failed to fetch recipe:", error);
    }
  };

  const deleteRecipe = async (recipeId: string) => {
    try {
      dispatch(setLoading(true));

      const recipeDoc = await getDocumentById(
        AppwriteConfig.RECIPES_COLLECTION_ID,
        recipeId
      );

      const { image = [], instructions = [] } = recipeDoc;

      const extractFileIdsFromStrings = (refs: string[]) =>
        refs
          .map((item) => item.split(" - ")[0].trim())
          .filter((id) => id && !isValidUrl(id));

      const imageFileIds = extractFileIdsFromStrings(image);

      const instructionFileIds = instructions
        .map((inst: string) => {
          try {
            const parsed = JSON.parse(inst);
            const imageId = parsed.image;
            if (imageId && !isValidUrl(imageId)) return imageId.trim();
            return null;
          } catch {
            return null;
          }
        })
        .filter((id: string | null): id is string => Boolean(id));

      const fileIds = [...imageFileIds, ...instructionFileIds];

      await Promise.all(
        fileIds.map((fileId) =>
          storage.deleteFile(AppwriteConfig.BUCKET_ID, fileId)
        )
      );

      await deleteDocument(AppwriteConfig.RECIPES_COLLECTION_ID, recipeId);

      setFieldState("recipeData", null);
      router.back();

      Toast.show({
        type: "success",
        text1: `Recipe deleted successfully.`,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to delete the recipe. Please try again.");
    } finally {
      dispatch(setRefreshProfile(true));
      dispatch(setLoading(false));
    }
  };

  const confirmDeleteRecipe = () => {
    setFieldState("showModal", false);
    setTimeout(() => {
      Alert.alert(
        "Delete Recipe",
        "Are you sure you want to delete this recipe?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              const id = recipe.recipeData?.id;
              if (id) deleteRecipe(id);
            },
          },
        ]
      );
    }, 300);
  };

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

  return {
    recipe,
    getRecipe,
    confirmDeleteRecipe,
    getNutritionEntry,
  };
};

export default useRecipeController;
