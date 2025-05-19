import { useCallback } from "react";
import { account, databases, storage } from "@/services/appwrite";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { setLoading } from "@/redux/slices/loadingSlice";
import {
  setProfileData,
  resetProfileData,
  guestProfile,
} from "@/redux/slices/profileSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

export function useProfileData() {
  const dispatch = useDispatch<AppDispatch>();

  const fetchProfile = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const user = await account.get();

      const userData = await databases.getDocument(
        AppwriteConfig.DATABASE_ID,
        AppwriteConfig.USERS_COLLECTION_ID,
        user.$id
      );

      let avatarUrl: string | undefined;
      if (userData.avatar) {
        try {
          avatarUrl = storage.getFileView(
            AppwriteConfig.BUCKET_ID,
            userData.avatar
          ).href;
        } catch (avatarError) {
          console.warn("Failed to generate avatar URL.", { avatarError });
          avatarUrl = guestProfile.avatarUrl;
        }
      } else {
        avatarUrl = guestProfile.avatarUrl;
      }

      let backgroundUrl: string | undefined;
      if (userData.profile_bg) {
        try {
          backgroundUrl = storage.getFileView(
            AppwriteConfig.BUCKET_ID,
            userData.profile_bg
          ).href;
        } catch (bgError) {
          console.warn("Failed to generate background URL.", { bgError });
          backgroundUrl = undefined;
        }
      } else {
        backgroundUrl = undefined;
      }

      const mappedProfileData = {
        username: userData.username,
        id: userData.user_id,
        avatarUrl: avatarUrl,
        bio: userData.bio,
        gender: userData.gender,
        birthday: userData.birthday,
        phone: userData.phone,
        email: user.email,
        followersCount: userData.followers_count,
        followingCount: userData.following_count,
        profileBg: backgroundUrl,
        metadata: userData.metadata,
      };
      dispatch(setProfileData(mappedProfileData));
    } catch (error) {
      console.warn("Failed to fetch user profile.", { error });
      dispatch(resetProfileData());
    } finally {
      dispatch(setLoading(false));
    }
  }, []);

  return { fetchProfile };
}
