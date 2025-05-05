import { useCallback, useEffect } from "react";
import { account, databases, storage } from "@/services/appwrite";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { ID, Permission, Role } from "react-native-appwrite";
import { useProfileData } from "@/hooks/useProfileData";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import mime from "mime";
import ImageColors from "react-native-image-colors";
import { Colors } from "@/constants/Colors";
import { ProfileData } from "@/redux/slices/profileSlice";
import { useFieldState } from "@/hooks/useFieldState";
import { setLoading } from "@/redux/slices/loadingSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

interface ProfileState {
  isBackgroundDark: boolean;
}

type Props = {
  profileData: ProfileData;
  profile: ReturnType<typeof useFieldState<ProfileState>>;
};

export default function EditProfileController({ profileData, profile }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { fetchProfile } = useProfileData();

  const isColorDark = (hex: string) => {
    const rgb = parseInt(hex.substring(1), 16);
    const r = (rgb >> 16) & 255;
    const g = (rgb >> 8) & 255;
    const b = rgb & 255;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance < 128;
  };

  const detectBackgroundDarkness = useCallback(
    async (profileBg?: string) => {
      if (!profileBg) return;
      dispatch(setLoading(true));
      try {
        const result = await ImageColors.getColors(profileBg, {
          fallback: Colors.brand.base,
          cache: true,
          key: profileBg,
        });

        const dominantColor =
          result.platform === "android"
            ? result.dominant
            : result.platform === "ios"
            ? result.background
            : Colors.brand.base;

        profile.setFieldState(
          "isBackgroundDark",
          isColorDark(dominantColor ?? Colors.brand.base)
        );
      } catch (error) {
        console.warn("Failed to get image colors", error);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [profile]
  );

  useEffect(() => {
    detectBackgroundDarkness(profileData?.profileBg);
  }, [profileData?.profileBg]);

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

  const uploadBackgroundImage = async (
    file: { name: string; type: string; size: number; uri: string },
    userId: string
  ) => {
    const uploaded = await storage.createFile(
      AppwriteConfig.BUCKET_ID,
      ID.unique(),
      file,
      [Permission.read(Role.user(userId)), Permission.write(Role.user(userId))]
    );
    return uploaded.$id;
  };

  const updateUserProfile = async (userId: string, fileId: string) => {
    await databases.updateDocument(
      AppwriteConfig.DATABASE_ID,
      AppwriteConfig.USERS_COLLECTION_ID,
      userId,
      { profile_bg: fileId }
    );
    await fetchProfile();
  };

  const onChangeBackgroundPress = useCallback(async () => {
    const file = await pickImageFile();
    if (!file) return;

    dispatch(setLoading(true));
    try {
      const user = await account.get();
      const userId = user.$id;

      const userDoc = await databases.getDocument(
        AppwriteConfig.DATABASE_ID,
        AppwriteConfig.USERS_COLLECTION_ID,
        userId
      );

      const oldFileId = userDoc.profile_bg;
      if (oldFileId) {
        await storage.deleteFile(AppwriteConfig.BUCKET_ID, oldFileId);
      }

      const newFileId = await uploadBackgroundImage(file, userId);
      await updateUserProfile(userId, newFileId);
    } catch (error) {
      console.error("Failed to update background:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, fetchProfile]);

  return {
    isBackgroundDark: profile.isBackgroundDark,
    onChangeBackgroundPress,
  };
}
