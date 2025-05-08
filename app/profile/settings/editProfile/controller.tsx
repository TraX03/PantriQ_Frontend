import { account, databases, storage } from "@/services/appwrite";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { ID, Permission, Role } from "react-native-appwrite";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import mime from "mime";
import ImageColors from "react-native-image-colors";
import { Colors } from "@/constants/Colors";
import { guestPicture } from "@/redux/slices/profileSlice";
import { setLoading } from "@/redux/slices/loadingSlice";

const EditProfileController = {
  isColorDark(hex: string) {
    const rgb = parseInt(hex.substring(1), 16);
    const r = (rgb >> 16) & 255;
    const g = (rgb >> 8) & 255;
    const b = rgb & 255;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance < 128;
  },

  detectBackgroundDarkness: async (
    profileBg: string,
    dispatch: any,
    profile: any
  ) => {
    if (!profileBg) return;
    dispatch(setLoading(true));
    try {
      const result = await ImageColors.getColors(profileBg, {
        fallback: Colors.brand.base,
        cache: true,
        key: profileBg,
      });

      const dominantColor =
        result.platform === "android" ? result.dominant : Colors.brand.base;

      profile.setFieldState(
        "isBackgroundDark",
        EditProfileController.isColorDark(dominantColor ?? Colors.brand.base)
      );
    } catch (error) {
      console.warn("Failed to get image colors", error);
    } finally {
      dispatch(setLoading(false));
    }
  },

  pickImageFile: async () => {
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
  },

  uploadFileAndUpdateProfile: async (
    file: { name: string; type: string; size: number; uri: string },
    userId: string,
    fieldKey: "profile_bg" | "avatar",
    fetchProfile: any
  ) => {
    const userDoc = await databases.getDocument(
      AppwriteConfig.DATABASE_ID,
      AppwriteConfig.USERS_COLLECTION_ID,
      userId
    );

    const oldFileId = userDoc[fieldKey];
    if (oldFileId && oldFileId !== guestPicture) {
      await storage.deleteFile(AppwriteConfig.BUCKET_ID, oldFileId);
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
  },

  onChangeImagePress: async (
    fieldKey: "profile_bg" | "avatar",
    dispatch: any,
    fetchProfile: any
  ) => {
    const file = await EditProfileController.pickImageFile();
    if (!file) return;

    dispatch(setLoading(true));
    try {
      const user = await account.get();
      await EditProfileController.uploadFileAndUpdateProfile(
        file,
        user.$id,
        fieldKey,
        fetchProfile
      );
    } catch (error) {
      console.error(`Failed to update ${fieldKey}:`, error);
    } finally {
      dispatch(setLoading(false));
    }
  },

  init: (
    profile: any,
    dispatch: any,
    fetchProfile: any
  ) => {
    return {
      isBackgroundDark: profile.isBackgroundDark,
      onChangeImagePress: (fieldKey: "profile_bg" | "avatar") =>
        EditProfileController.onChangeImagePress(
          fieldKey,
          dispatch,
          fetchProfile
        ),
    };
  },
};

export default EditProfileController;
