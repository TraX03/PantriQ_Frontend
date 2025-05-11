import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import mime from "mime";
import { Alert, Keyboard } from "react-native";
import { account, storage, databases } from "@/services/appwrite";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { ID, Permission, Role } from "react-native-appwrite";
import { setLoading } from "@/redux/slices/loadingSlice";
import { useFieldState } from "@/hooks/useFieldState";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useLocalSearchParams, router } from "expo-router";
import { useCallback, useMemo } from "react";

export interface CreateFormState {
  title: string;
  content: string;
  images: string[];
  postType: "recipe" | "tips" | "discussion" | "community";
  ingredients: { name: string; quantity: string }[];
  focusedIndex: number | null;
  instructions: {
    image?: string;
    text: string;
  }[];
}

export const useCreateFormController = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { type } = useLocalSearchParams<{ type: string }>();

  const initialPostType = (type || "discussion") as CreateFormState["postType"];

  const create = useFieldState<CreateFormState>({
    title: "",
    content: "",
    images: [],
    postType: initialPostType,
    ingredients: [],
    focusedIndex: null,
    instructions: [{ text: "", image: undefined }],
  });

  const handlePickImage = useCallback(async () => {
    if (create.images.length >= 5) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      create.setFieldState("images", [...create.images, result.assets[0].uri]);
    }
  }, [create.images]);

  const uploadImage = async (
    uri: string,
    userId: string
  ): Promise<string | null> => {
    const fileInfo = await FileSystem.getInfoAsync(uri, { size: true });
    if (!fileInfo.exists || !fileInfo.size) {
      console.warn(`Skipping file at ${uri}: could not retrieve size.`);
      return null;
    }

    const fileName = uri.split("/").pop() || `image-${Date.now()}`;
    const mimeType = mime.getType(uri) || "image/jpeg";

    const file = {
      uri,
      name: fileName,
      type: mimeType,
      size: fileInfo.size,
    };

    try {
      const uploaded = await storage.createFile(
        AppwriteConfig.BUCKET_ID,
        ID.unique(),
        file,
        [
          Permission.read(Role.user(userId)),
          Permission.write(Role.user(userId)),
        ]
      );
      return uploaded.$id;
    } catch (err) {
      console.error(`Failed to upload image: ${fileName}`, err);
      return null;
    }
  };

  const handleSubmit = useCallback(async () => {
    const { title, content, postType, images, ingredients, instructions } =
      create;
    dispatch(setLoading(true));

    const getSuccessMessage = () =>
      `${
        postType === "community"
          ? "Community"
          : postType === "recipe"
          ? "Recipe"
          : "Post"
      } created successfully!`;

    const getErrorMessage = () =>
      `Failed to create ${
        postType === "community"
          ? "community"
          : postType === "recipe"
          ? "recipe"
          : "post"
      }. Please try again.`;

    try {
      const user = await account.get();
      const userId = user.$id;

      const uploadedImageIds = (
        await Promise.all(images.map((uri) => uploadImage(uri, userId)))
      ).filter((id): id is string => id !== null);

      const baseData = {
        image: uploadedImageIds,
        created_at: new Date().toISOString(),
      };

      if (postType === "community") {
        const communityData = {
          ...baseData,
          name: title,
          description: content,
          image: uploadedImageIds[0],
          creator_id: userId,
        };

        await databases.createDocument(
          AppwriteConfig.DATABASE_ID,
          AppwriteConfig.COMMUNITIES_COLLECTION_ID,
          ID.unique(),
          communityData,
          [Permission.read(Role.any()), Permission.write(Role.user(userId))]
        );
      } else {
        const postData = {
          ...baseData,
          title,
          content,
          type: postType,
          author_id: userId,
          ...(postType === "recipe" && {
            ingredients: ingredients.map((item) =>
              `${item.quantity} ${item.name}`.trim()
            ),
            instructions: instructions.map((item) => item.text.trim()),
          }),
        };

        await databases.createDocument(
          AppwriteConfig.DATABASE_ID,
          AppwriteConfig.POSTS_COLLECTION_ID,
          ID.unique(),
          postData,
          [Permission.read(Role.any()), Permission.write(Role.user(userId))]
        );
      }

      Alert.alert("Success", getSuccessMessage());
      router.back();
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", getErrorMessage());
    } finally {
      dispatch(setLoading(false));
    }
  }, [create, dispatch]);

  const isFormValid = useMemo(() => {
    const isRecipeValid =
      create.title.trim() &&
      create.ingredients.length > 0 &&
      create.ingredients.every((i) => i.name.trim() && i.quantity.trim()) &&
      create.instructions.length > 0 &&
      create.instructions.every((i) => i.text.trim());

    const isCommonValid =
      create.title.trim() && create.content.trim() && create.images.length > 0;

    return create.postType === "recipe" ? isRecipeValid : isCommonValid;
  }, [create]);

  const updateIngredient = useCallback(
    (index: number, field: "name" | "quantity", value: string) => {
      const updated = [...create.ingredients];
      updated[index][field] = value.trim();
      create.setFieldState("ingredients", updated);
    },
    [create]
  );

  const modifyIngredient = useCallback(
    (action: "add" | "remove", index?: number) => {
      const updated = [...create.ingredients];

      if (action === "add") {
        updated.push({ name: "", quantity: "" });
      } else if (action === "remove" && index !== undefined) {
        updated.splice(index, 1);
      }

      create.setFieldState("ingredients", updated);
    },
    [create]
  );

  const selectSuggestion = useCallback(
    (index: number, suggestion: string) => {
      const updated = [...create.ingredients];
      updated[index].name = suggestion;
      create.setFieldState("ingredients", updated);
      create.setFieldState("focusedIndex", null);
      Keyboard.dismiss();
    },
    [create]
  );

  const modifyInstruction = useCallback(
    (action: "add" | "remove", index?: number) => {
      const updated = [...create.instructions];

      if (action === "add") {
        updated.push({ text: "", image: undefined });
      } else if (action === "remove" && index !== undefined) {
        updated.splice(index, 1);
      }

      create.setFieldState("instructions", updated);
    },
    [create]
  );

  const updateInstruction = useCallback(
    (index: number, text: string) => {
      const updated = [...create.instructions];
      updated[index].text = text;
      create.setFieldState("instructions", updated);
    },
    [create]
  );

  const updateInstructionImage = useCallback(
    async (index: number, shouldRemove = false) => {
      const updated = [...create.instructions];

      if (shouldRemove) {
        updated[index].image = undefined;
        create.setFieldState("instructions", updated);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        updated[index].image = uri;
        create.setFieldState("instructions", updated);
      }
    },
    [create]
  );

  return {
    create,
    controller: {
      handlePickImage,
      handleSubmit,
      updateIngredient,
      modifyIngredient,
      selectSuggestion,
      modifyInstruction,
      updateInstruction,
      updateInstructionImage,
      isFormValid,
    },
  };
};

export default useCreateFormController;
