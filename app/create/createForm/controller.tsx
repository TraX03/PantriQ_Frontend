import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import mime from "mime";
import { Alert, Keyboard } from "react-native";
import { account, databases } from "@/services/appwrite";
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
import { detectBackgroundDarkness } from "@/utility/imageUtils";
import { useMediaHandler } from "@/hooks/useMediaHandler";

export interface CreateFormState {
  title: string;
  content: string;
  images: string[];
  postType: PostType;
  ingredient: { name: string; quantity: string }[];
  instructions: { image?: string; text: string }[];
  category: { name: string }[];
  area: string;
  focusedIndex: { [K in EntryType]?: number | null };
}

export const useCreateFormController = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pickImageFile, uploadFile } = useMediaHandler();
  const { type } = useLocalSearchParams<{ type: string }>();

  const create = useFieldState<CreateFormState>({
    title: "",
    content: "",
    images: [],
    postType: (type || "discussion") as PostType,
    ingredient: [],
    instructions: [{ text: "" }],
    category: [],
    area: "",
    focusedIndex: {},
  });

  const handlePickImage = useCallback(async () => {
    if (create.images.length >= 5) return;
    const file = await pickImageFile();
    if (file) {
      create.setFieldState("images", [...create.images, file.uri]);
    }
  }, [create]);

  const uploadImage = useCallback(
    async (uri: string, userId: string) => {
      const name = uri.split("/").pop() ?? `image-${Date.now()}`;
      const type = mime.getType(uri) ?? "image/jpeg";

      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) return null;

      return uploadFile({ uri, name, type, size: fileInfo.size ?? 0 }, userId);
    },
    [uploadFile]
  );

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

      const metadata = {
        images: await Promise.all(
          images.map(async (uri) => {
            try {
              return { isDark: await detectBackgroundDarkness(uri) };
            } catch {
              return { isDark: false };
            }
          })
        ),
      };

      const commonFields = {
        image: uploadedImageIds,
        created_at: new Date().toISOString(),
        metadata: JSON.stringify(metadata),
      };

      const payloadMap: Record<PostType, any> = {
        discussion: {
          ...commonFields,
          title,
          content,
          type: postType,
          author_id: userId,
        },
        tips: {
          ...commonFields,
          title,
          content,
          type: postType,
          author_id: userId,
        },
        community: {
          ...commonFields,
          name: title,
          description: content,
          image: uploadedImageIds[0],
          creator_id: userId,
        },
        recipe: {
          ...commonFields,
          title,
          description: content,
          author_id: userId,
          ingredients: ingredient.map((i) => `${i.name} - ${i.quantity}`),
          instructions: await Promise.all(
            instructions.map(async ({ image, text }) => {
              if (image?.startsWith("file://")) {
                const id = await uploadImage(image, userId);
                return id ? `${id} - ${text}` : text;
              }
              return image ? `${image} - ${text}` : text;
            })
          ),
          category: category.map((c) => c.name),
          area,
        },
      };

      const collectionMap: Record<PostType, string> = {
        recipe: AppwriteConfig.RECIPES_COLLECTION_ID,
        discussion: AppwriteConfig.POSTS_COLLECTION_ID,
        tips: AppwriteConfig.POSTS_COLLECTION_ID,
        community: AppwriteConfig.COMMUNITIES_COLLECTION_ID,
      };

      await databases.createDocument(
        AppwriteConfig.DATABASE_ID,
        collectionMap[postType],
        ID.unique(),
        payloadMap[postType],
        [Permission.read(Role.any()), Permission.write(Role.user(userId))]
      );

      Alert.alert(
        "Success",
        `${postType[0].toUpperCase() + postType.slice(1)} created successfully!`
      );
      router.back();
    } catch (err) {
      console.error("Error creating post:", err);
      Alert.alert(
        "Error",
        `Failed to create ${create.postType}. Please try again.`
      );
    } finally {
      dispatch(setRefreshProfile(true));
      dispatch(setLoading(false));
    }
  }, [create, dispatch, uploadImage]);

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
    const hasText = (str: string) => str.trim().length > 0;

    if (postType === "recipe") {
      return (
        hasText(title) &&
        ingredient.length > 0 &&
        ingredient.every((i) => hasText(i.name) && hasText(i.quantity)) &&
        instructions.length > 0 &&
        instructions.every((i) => hasText(i.text)) &&
        hasText(area) &&
        category.length > 0 &&
        category.every((c) => hasText(c.name))
      );
    }

    return hasText(title) && hasText(content) && images.length > 0;
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
        updated.push(
          type === "ingredient" ? { name: "", quantity: "" } : { name: "" }
        );
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
        create.setFields({
          area: suggestion,
          focusedIndex: {
            ...create.focusedIndex,
            [type]: null,
          },
        });
        Keyboard.dismiss();
        return;
      }

      const updated = [...(create[type] as any[])];
      updated[index].name = suggestion;
      create.setFields({
        [type]: updated,
        focusedIndex: {
          ...create.focusedIndex,
          [type]: null,
        },
      });
      Keyboard.dismiss();
    },
    [create]
  );

  const modifyInstruction = useCallback(
    (action: "add" | "remove", index?: number) => {
      const updated = [...create.instructions];
      if (action === "add") updated.push({ text: "" });
      else if (action === "remove" && index !== undefined)
        updated.splice(index, 1);
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
        updated[index].image = result.assets[0].uri;
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
