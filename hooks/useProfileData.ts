import { useCallback } from "react";
import { account, databases, storage } from "@/services/appwrite";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import reactotron from "reactotron-react-native";
import { setLoading } from "@/redux/slices/loadingSlice";
import {
  setProfileData,
  resetProfileData,
  guestProfile,
} from "@/redux/slices/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

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
        avatarUrl: avatarUrl,
        bio: userData.bio,
        gender: userData.gender,
        birthday: userData.birthday,
        phone: userData.phone,
        email: user.email,
        followersCount: userData.followers_count,
        followingCount: userData.following_count,
        profileBg: backgroundUrl || undefined,
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
