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
  storage,
} from "@/services/appwrite";
import { getImageUrl, isValidUrl } from "@/utility/imageUtils";
import { getInteractionStatus } from "@/utility/interactionUtils";
import { parseMetadata } from "@/utility/metadataUtils";
import { fetchUsers } from "@/utility/userCacheUtils";
import { router } from "expo-router";
import { Alert } from "react-native";
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
  showStepsModal: boolean;
  isInstructionsOverflow: boolean;
  nutritionData: any;
  expanded: boolean;
  interactionState: {
    isLiked: boolean;
    likeDocId?: string;
    isBookmarked: boolean;
    bookmarkDocId?: string;
  };
}

export const useRecipeController = (interactionMap?: Map<string, any>) => {
  const dispatch = useDispatch<AppDispatch>();

  const recipe = useFieldState<RecipeState>({
    recipeData: null,
    imageIndex: 0,
    showModal: false,
    fullscreenImage: null,
    metadata: null,
    showStepsModal: false,
    isInstructionsOverflow: false,
    nutritionData: null,
    expanded: false,
    interactionState: {
      isLiked: false,
      likeDocId: undefined,
      isBookmarked: false,
      bookmarkDocId: undefined,
    },
  });

  const { setFields, setFieldState } = recipe;

  const parseJsonSafe = <T,>(jsonStr: string, fallback: T) => {
    try {
      return JSON.parse(jsonStr) as T;
    } catch {
      return fallback;
    }
  };

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

      const ingredients = Array.isArray(recipeDoc.ingredients)
        ? recipeDoc.ingredients.map((item) =>
            parseJsonSafe<{ name: string; quantity: string }>(item, {
              name: "",
              quantity: "",
            })
          )
        : [];

      const instructions = Array.isArray(recipeDoc.instructions)
        ? recipeDoc.instructions.map((item) => {
            const parsed = parseJsonSafe<{ text: string; image?: string }>(
              item,
              {
                text: "",
                image: undefined,
              }
            );
            let imageUrl: string | undefined;
            if (parsed.image) {
              imageUrl = isValidUrl(parsed.image)
                ? parsed.image
                : getImageUrl(parsed.image);
            }
            return { text: parsed.text, image: imageUrl };
          })
        : [];

      const recipe: Recipe = {
        id: recipeDoc.$id,
        title: recipeDoc.title,
        author: usersMap.get(recipeDoc.author_id)?.username ?? "Unknown",
        authorId: recipeDoc.author_id,
        images: Array.isArray(recipeDoc.image)
          ? recipeDoc.image.map(getImageUrl)
          : [],
        ingredients,
        instructions,
        rating: recipeDoc.rating ?? 0,
        commentCount: recipeDoc.commentCount ?? 0,
      };

      if (currentUser && interactionMap) {
        setFieldState(
          "interactionState",
          getInteractionStatus(recipeDoc.$id, interactionMap)
        );
      }

      setFields({
        recipeData: recipe,
        metadata: parseMetadata(recipeDoc.metadata),
      });
    } catch (error) {
      console.error("Failed to fetch recipe:", error);
      return null;
    }
  };

  const deleteRecipe = async (recipeId: string) => {
    try {
      dispatch(setLoading(true));

      const recipeDoc = await getDocumentById(
        AppwriteConfig.RECIPES_COLLECTION_ID,
        recipeId
      );

      const extractFileIdsFromStrings = (refs: string[]) =>
        refs
          .map((item) => item.split(" - ")[0].trim())
          .filter((id) => id && !isValidUrl(id));

      const imageFileIds = extractFileIdsFromStrings(recipeDoc.image ?? []);

      const instructionFileIds = (recipeDoc.instructions ?? [])
        .map((inst: string) => {
          const parsed = parseJsonSafe<{ image?: string }>(inst, {});
          return parsed.image && !isValidUrl(parsed.image)
            ? parsed.image.trim()
            : null;
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
