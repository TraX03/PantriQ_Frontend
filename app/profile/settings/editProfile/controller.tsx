import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { useMediaHandler } from "@/hooks/useMediaHandler";
import { useProfileData } from "@/hooks/useProfileData";
import { setLoading } from "@/redux/slices/loadingSlice";
import { guestPicture } from "@/redux/slices/profileSlice";
import { AppDispatch } from "@/redux/store";
import {
  getCurrentUser,
  getDocumentById,
  storage,
  updateDocument,
} from "@/services/appwrite";
import { detectBackgroundDarkness } from "@/utility/imageUtils";
import { parseMetadata, setNestedMetadata } from "@/utility/metadataUtils";
import { useMemo } from "react";
import { useDispatch } from "react-redux";

export const useEditProfileController = (profileData: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { fetchProfile } = useProfileData();
  const { pickImageFile, uploadFile } = useMediaHandler();

  const metadata = useMemo(
    () => parseMetadata(profileData?.metadata),
    [profileData]
  );
  const isBackgroundDark = metadata?.profileBg?.isDark ?? false;

  const uploadFileAndUpdateProfile = async (
    file: { name: string; type: string; size: number; uri: string },
    userId: string,
    fieldKey: "profile_bg" | "avatar"
  ) => {
    const userDoc = await getDocumentById(
      AppwriteConfig.USERS_COLLECTION_ID,
      userId
    );
    const oldFileId = userDoc[fieldKey];
    const shouldDeleteOldFile = oldFileId && oldFileId !== guestPicture;

    if (shouldDeleteOldFile) {
      storage
        .deleteFile(AppwriteConfig.BUCKET_ID, oldFileId)
        .catch((err) => console.warn("Failed to delete old file:", err));
    }

    const uploadedId = await uploadFile(file, userId);
    if (!uploadedId) return;

    const updatePayload: Record<string, any> = {
      [fieldKey]: uploadedId,
    };

    if (fieldKey === "profile_bg") {
      const existingMetadata = parseMetadata(userDoc.metadata);
      const isDark = await detectBackgroundDarkness(file.uri);
      const updatedMetadata = setNestedMetadata(
        existingMetadata,
        ["profileBg", "isDark"],
        isDark
      );
      updatePayload.metadata = JSON.stringify(updatedMetadata);
    }

    await updateDocument(
      AppwriteConfig.USERS_COLLECTION_ID,
      userId,
      updatePayload
    );

    await fetchProfile();
  };

  const onChangeImagePress = async (fieldKey: "profile_bg" | "avatar") => {
    const file = await pickImageFile();
    if (!file) return;

    dispatch(setLoading(true));
    try {
      const user = await getCurrentUser();
      await uploadFileAndUpdateProfile(file, user.$id, fieldKey);
    } catch (error) {
      console.error(`Failed to update ${fieldKey}:`, error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    isBackgroundDark,
    onChangeImagePress,
  };
};

export default useEditProfileController;
