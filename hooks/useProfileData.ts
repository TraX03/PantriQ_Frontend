import { useCallback } from "react";
import { account, databases, storage } from "@/services/appwrite";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import reactotron from "reactotron-react-native";
import { setLoading } from "@/redux/slices/loadingSlice";
import { setProfileData, resetProfileData } from "@/redux/slices/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

export function useProfileData() {
  const dispatch = useDispatch<AppDispatch>();
  const profileData = useSelector((state: RootState) => state.profile.userData);

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
      try {
        avatarUrl = storage.getFileView(
          AppwriteConfig.BUCKET_ID,
          userData.avatar
        ).href;
      } catch (avatarError) {
        reactotron.log("Failed to generate avatar URL.", {
          avatarError,
        });
        avatarUrl = profileData.avatarUrl;
      }

      let backgroundUrl: string | undefined;
      try {
        backgroundUrl = storage.getFileView(
          AppwriteConfig.BUCKET_ID,
          userData.profile_bg,
        ).href;
      } catch (avatarError) {
        reactotron.log("Failed to generate background URL.", {
          avatarError,
        });
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
        profileBg: backgroundUrl,
      };
      dispatch(setProfileData(mappedProfileData));
    } catch (error) {
      reactotron.log("Failed to fetch user profile.", { error });
      dispatch(resetProfileData());
    } finally {
      dispatch(setLoading(false));
    }
  }, []);

  return { fetchProfile };
}
