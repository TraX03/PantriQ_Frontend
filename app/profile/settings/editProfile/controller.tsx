import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useFieldState } from "@/hooks/useFieldState";
import { useProfileData } from "@/hooks/useProfileData";
import { account, databases, storage } from "@/services/appwrite";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { ID, Permission, Role } from "react-native-appwrite";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import mime from "mime";
import { guestPicture } from "@/redux/slices/profileSlice";
import { setLoading } from "@/redux/slices/loadingSlice";

interface EditProfileState {
  isBackgroundDark: boolean;
}

export const useEditProfileController = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { fetchProfile } = useProfileData();

  const profile = useFieldState<EditProfileState>({
    isBackgroundDark: false,
  });

  const pickImageFile = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled || result.assets.length === 0) return null;

    const asset = result.assets[0];
    const mimeType = mime.getType(asset.uri) || "application/octet-stream";
    const localFileInfo = await FileSystem.getInfoAsync(asset.uri);

    return {
      name: asset.fileName || `background_${Date.now()}`,
      type: mimeType,
      size: localFileInfo.exists ? localFileInfo.size ?? 0 : 0,
      uri: asset.uri,
    };
  };

  const uploadFileAndUpdateProfile = async (
    file: { name: string; type: string; size: number; uri: string },
    userId: string,
    fieldKey: "profile_bg" | "avatar"
  ) => {
    const userDoc = await databases.getDocument(
      AppwriteConfig.DATABASE_ID,
      AppwriteConfig.USERS_COLLECTION_ID,
      userId
    );

    const oldFileId = userDoc[fieldKey];
    if (oldFileId && oldFileId !== guestPicture) {
      try {
        await storage.deleteFile(AppwriteConfig.BUCKET_ID, oldFileId);
      } catch (err) {
        console.warn("Failed to delete old file:", err);
      }
    }

    const uploaded = await storage.createFile(
      AppwriteConfig.BUCKET_ID,
      ID.unique(),
      file,
      [Permission.read(Role.user(userId)), Permission.write(Role.user(userId))]
    );

    await databases.updateDocument(
      AppwriteConfig.DATABASE_ID,
      AppwriteConfig.USERS_COLLECTION_ID,
      userId,
      { [fieldKey]: uploaded.$id }
    );

    await fetchProfile();
  };

  const onChangeImagePress = async (fieldKey: "profile_bg" | "avatar") => {
    const file = await pickImageFile();
    if (!file) return;

    dispatch(setLoading(true));
    try {
      const user = await account.get();
      await uploadFileAndUpdateProfile(file, user.$id, fieldKey);
    } catch (error) {
      console.error(`Failed to update ${fieldKey}:`, error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    profile,
    onChangeImagePress,
  };
};

export default useEditProfileController;
