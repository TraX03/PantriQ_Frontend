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
import { PostType } from "@/components/PostCard";
import { EntryType } from "@/components/EntryListForm";
import { setRefreshProfile } from "@/redux/slices/profileSlice";

export interface CreateFormState {
  title: string;
  content: string;
  images: string[];
  postType: PostType;
  ingredient: { name: string; quantity: string }[];
  instructions: { image?: string; text: string }[];
  category: { name: string }[];
  area: string;
  focusedIndex: {
    [K in EntryType]?: number | null;
  };
}

export const useCreateFormController = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { type } = useLocalSearchParams<{ type: string }>();

  const create = useFieldState<CreateFormState>({
    title: "",
    content: "",
    images: [],
    postType: (type || "discussion") as PostType,
    ingredient: [],
    instructions: [{ text: "", image: undefined }],
    category: [],
    area: "",
    focusedIndex: { ingredient: null, category: null, area: null },
  });

  const handlePickImage = useCallback(async () => {
    if (create.images.length >= 5) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      create.setFieldState("images", [...create.images, uri]);
    }
  }, [create]);

  const uploadImage = async (
    uri: string,
    userId: string
  ): Promise<string | null> => {
    const fileInfo = await FileSystem.getInfoAsync(uri, { size: true });
    if (!fileInfo.exists || !fileInfo.size) return null;

    const fileName = uri.split("/").pop() || `image-${Date.now()}`;
    const mimeType = mime.getType(uri) || "image/jpeg";

    try {
      const uploaded = await storage.createFile(
        AppwriteConfig.BUCKET_ID,
        ID.unique(),
        { uri, name: fileName, type: mimeType, size: fileInfo.size },
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
    const {
      title,
      content,
      postType,
      images,
      ingredient,
      instructions,
      category,
      area,
    } = create;
    dispatch(setLoading(true));

    try {
      const user = await account.get();
      const userId = user.$id;

      const uploadedImageIds = (
        await Promise.all(images.map((uri) => uploadImage(uri, userId)))
      ).filter((id): id is string => !!id);

      const baseData = {
        image: uploadedImageIds,
        created_at: new Date().toISOString(),
      };

      const basePostData = {
        ...baseData,
        title,
        content,
        type: postType,
        author_id: userId,
      };

      const payloadMap = {
        community: {
          ...baseData,
          name: title,
          description: content,
          image: uploadedImageIds[0],
          creator_id: userId,
        },
        recipe: {
          ...baseData,
          title,
          description: content,
          author_id: userId,
          ingredients: ingredient.map((i) => `${i.name} - ${i.quantity}`),
          instructions: await Promise.all(
            instructions.map(async ({ image, text }) => {
              if (image?.startsWith("file://")) {
                const uploadedId = await uploadImage(image, userId);
                return uploadedId ? `${uploadedId} - ${text}` : text;
              }
              return image ? `${image} - ${text}` : text;
            })
          ),
          category: category.map((c) => c.name),
          area,
        },
        discussion: basePostData,
        tips: basePostData,
      };

      const collectionId: Record<PostType, string> = {
        recipe: AppwriteConfig.RECIPES_COLLECTION_ID,
        discussion: AppwriteConfig.POSTS_COLLECTION_ID,
        tips: AppwriteConfig.POSTS_COLLECTION_ID,
        community: AppwriteConfig.COMMUNITIES_COLLECTION_ID,
      };

      await databases.createDocument(
        AppwriteConfig.DATABASE_ID,
        collectionId[postType],
        ID.unique(),
        payloadMap[postType],
        [Permission.read(Role.any()), Permission.write(Role.user(userId))]
      );

      Alert.alert(
        "Success",
        `${postType[0].toUpperCase() + postType.slice(1)} created successfully!`
      );
      router.back();
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", `Failed to create ${postType}. Please try again.`);
    } finally {
      dispatch(setRefreshProfile(true));
      dispatch(setLoading(false));
    }
  }, [create, dispatch]);

  const isFormValid = useMemo(() => {
    const {
      title,
      content,
      images,
      ingredient,
      instructions,
      area,
      category,
      postType,
    } = create;

    const hasTitle = title.trim().length > 0;
    const hasContent = content.trim().length > 0;
    const hasImages = images.length > 0;
    const hasArea = area.trim().length > 0;

    const filledIngredients =
      ingredient.length > 0 &&
      ingredient.every((i) => i.name.trim() && i.quantity.trim());

    const filledInstructions =
      instructions.length > 0 && instructions.every((i) => i.text.trim());

    const hasCategory =
      category.length > 0 && category.every((c) => c.name.trim());

    const isCommonValid = hasTitle && hasContent && hasImages;

    if (postType === "recipe") {
      return (
        hasTitle &&
        filledIngredients &&
        filledInstructions &&
        hasArea &&
        hasCategory
      );
    }

    return isCommonValid;
  }, [create]);

  const updateEntry = useCallback(
    (
      type: keyof CreateFormState,
      index: number,
      field: "name" | "quantity",
      value: string
    ) => {
      if (type === "area" && field === "name") {
        create.setFieldState("area", value.trim());
        return;
      }
      const updated = [...(create[type] as any[])];
      if (field === "quantity" && !(updated[index]?.quantity !== undefined))
        return;
      updated[index][field] = value.trim();
      create.setFieldState(type, updated);
    },
    [create]
  );

  const modifyEntry = useCallback(
    (type: keyof CreateFormState, action: "add" | "remove", index?: number) => {
      if (type === "area") return;

      const updated = [...(create[type] as any[])];
      if (action === "add") {
        const newItem: any = { name: "" };
        if (type === "ingredient") newItem.quantity = "";
        updated.push(newItem);
      } else if (action === "remove" && index !== undefined) {
        updated.splice(index, 1);
      }
      create.setFieldState(type, updated);
    },
    [create]
  );

  const selectSuggestion = useCallback(
    (type: keyof CreateFormState, index: number, suggestion: string) => {
      if (type === "area") {
        create.setFieldState("area", suggestion);
        create.setFieldState("focusedIndex", {
          ...create.focusedIndex,
          [type]: null,
        });
        Keyboard.dismiss();
        return;
      }

      const updated = [...(create[type] as any[])];
      updated[index].name = suggestion;
      create.setFieldState(type, updated);
      create.setFieldState("focusedIndex", {
        ...create.focusedIndex,
        [type]: null,
      });
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
      updateEntry,
      modifyEntry,
      selectSuggestion,
      modifyInstruction,
      updateInstruction,
      updateInstructionImage,
      isFormValid,
    },
  };
};

export default useCreateFormController;
