import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useFieldState } from "@/hooks/useFieldState";
import { useProfileData } from "@/hooks/useProfileData";
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

export interface EditProfileState {
  isBackgroundDark: boolean;
}

export const useEditProfileController = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { fetchProfile } = useProfileData();

  const profileData = useSelector((state: RootState) => state.profile.userData);
  const loading = useSelector((state: RootState) => state.loading.loading);

  const profile = useFieldState<EditProfileState>({
    isBackgroundDark: false,
  });

  const { setFieldState } = profile;

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profileData?.profileBg) {
      detectBackgroundDarkness(profileData.profileBg);
    }
  }, [profileData?.profileBg]);

  const isColorDark = (hex: string) => {
    const rgb = parseInt(hex.substring(1), 16);
    const r = (rgb >> 16) & 255;
    const g = (rgb >> 8) & 255;
    const b = rgb & 255;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance < 128;
  };

  const detectBackgroundDarkness = async (profileBg: string) => {
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

      setFieldState(
        "isBackgroundDark",
        isColorDark(dominantColor ?? Colors.brand.base)
      );
    } catch (error) {
      console.warn("Failed to get image colors", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

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
    profileData,
    loading,
    isBackgroundDark: profile.isBackgroundDark,
    onChangeImagePress,
  };
};

export default useEditProfileController;
