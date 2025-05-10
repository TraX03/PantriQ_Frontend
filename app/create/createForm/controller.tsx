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
import { useCallback } from "react";

export interface CreateFormState {
  title: string;
  content: string;
  images: string[];
  postType: "recipe" | "tips" | "discussion" | "community";
  ingredients: { name: string; quantity: string }[];
  focusedIndex: number | null;
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
  });

  const handlePickImage = useCallback(async () => {
    if (create.images.length >= 5) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
    const { title, content, postType, images } = create;

    if (!title || !content || !postType) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    if (postType === "recipe" && create.ingredients.length === 0) {
      Alert.alert(
        "Error",
        "Please add at least one ingredient for your recipe."
      );
      return;
    }

    dispatch(setLoading(true));

    try {
      const user = await account.get();
      const userId = user.$id;

      const uploadedImageIds = (
        await Promise.all(images.map((uri) => uploadImage(uri, userId)))
      ).filter((id): id is string => id !== null);

      const newPost = {
        type: postType,
        title,
        content,
        image: uploadedImageIds,
        author_id: userId,
        created_at: new Date().toISOString(),
        ingredients: postType === "recipe" ? create.ingredients : undefined,
      };

      await databases.createDocument(
        AppwriteConfig.DATABASE_ID,
        AppwriteConfig.POSTS_COLLECTION_ID,
        ID.unique(),
        newPost,
        [
          Permission.read(Role.user(userId)),
          Permission.write(Role.user(userId)),
        ]
      );

      Alert.alert("Success", "Post created successfully!");
      router.back();
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", "Failed to create post. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  }, [create, dispatch]);

  const updateIngredient = useCallback(
    (index: number, field: "name" | "quantity", value: string) => {
      const updated = [...create.ingredients];
      updated[index][field] = value.trim();
      create.setFieldState("ingredients", updated);
    },
    [create]
  );

  const addIngredient = useCallback(() => {
    create.setFieldState("ingredients", [
      ...create.ingredients,
      { name: "", quantity: "" },
    ]);
  }, [create]);

  const removeIngredient = useCallback(
    (index: number) => {
      const updated = [...create.ingredients];
      updated.splice(index, 1);
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

  return {
    create,
    controller: {
      handlePickImage,
      handleSubmit,
      updateIngredient,
      addIngredient,
      removeIngredient,
      selectSuggestion,
    },
  };
};

export default useCreateFormController;
