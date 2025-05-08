import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import mime from "mime";
import { Alert } from "react-native";
import { account, storage, databases } from "@/services/appwrite";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { ID, Permission, Role } from "react-native-appwrite";
import { setLoading } from "@/redux/slices/loadingSlice";
import { AppDispatch } from "@/redux/store";
import { useFieldState } from "@/hooks/useFieldState";
import { CreateFormState } from "./component";
import { router } from "expo-router";

const CreateFormController = {
  handlePickImage:
    (images: string[], setImages: (imgs: string[]) => void) => async () => {
      if (images.length >= 5) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImages([...images, uri]);
      }
    },

  handleSubmit: async (
    dispatch: AppDispatch,
    create: ReturnType<typeof useFieldState<CreateFormState>>
  ) => {
    const { title, content, postType, images } = create;

    if (!title || !content || !postType) {
      Alert.alert("Please fill out all fields.");
      return;
    }

    try {
      dispatch(setLoading(true));
      const user = await account.get();
      const userId = user.$id;

      const uploadedImageIds: string[] = [];
      for (const uri of images) {
        const fileInfo = await FileSystem.getInfoAsync(uri, { size: true });
        if (!fileInfo.exists || !fileInfo.size) {
          console.warn(`Skipping file at ${uri}: could not retrieve size.`);
          continue;
        }

        const fileName = uri.split("/").pop() || `image-${Date.now()}`;
        const mimeType = mime.getType(uri) || "image/jpeg";
        const file = {
          uri,
          name: fileName,
          type: mimeType,
          size: fileInfo.size,
        };

        const uploaded = await storage.createFile(
          AppwriteConfig.BUCKET_ID,
          ID.unique(),
          file,
          [
            Permission.read(Role.user(userId)),
            Permission.write(Role.user(userId)),
          ]
        );
        uploadedImageIds.push(uploaded.$id);
      }

      const newPost = {
        type: postType,
        title,
        content,
        image: uploadedImageIds,
        author_id: userId,
        created_at: new Date().toISOString(),
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

      Alert.alert("Post created!");
      router.back();
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Failed to create post");
    } finally {
      dispatch(setLoading(false));
    }
  },
};

export default CreateFormController;
