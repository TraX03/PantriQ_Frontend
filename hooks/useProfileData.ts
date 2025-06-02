import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { setLoading } from "@/redux/slices/loadingSlice";
import {
  guestProfile,
  ProfileData,
  resetProfileData,
  setProfileData,
} from "@/redux/slices/profileSlice";
import { AppDispatch } from "@/redux/store";
import { getCurrentUser, getDocumentById } from "@/services/appwrite";
import { getImageUrl } from "@/utility/imageUtils";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

export function useProfileData() {
  const dispatch = useDispatch<AppDispatch>();

  const fetchProfile = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const user = await getCurrentUser();
      const userData = await getDocumentById(
        AppwriteConfig.USERS_COLLECTION_ID,
        user.$id
      );

      let avatarUrl: string | undefined;
      if (userData.avatar) {
        try {
          avatarUrl = getImageUrl(userData.avatar);
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
          backgroundUrl = getImageUrl(userData.profile_bg);
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
        mealRegion: userData.region_pref,
        avoidIngredients: userData.avoid_ingredients,
        diet: userData.region_pref,
      };
      dispatch(setProfileData(mappedProfileData));
    } catch (error) {
      console.warn("Failed to fetch user profile.", { error });
      dispatch(resetProfileData());
    } finally {
      dispatch(setLoading(false));
    }
  }, []);

  const getUserProfileData = useCallback(
    async (id: string): Promise<ProfileData | null> => {
      try {
        const doc = await getDocumentById(
          AppwriteConfig.USERS_COLLECTION_ID,
          id
        );
        const avatarUrl = doc.avatar
          ? getImageUrl(doc.avatar)
          : guestProfile.avatarUrl;
        const backgroundUrl = doc.profile_bg ? getImageUrl(doc.profile_bg) : "";

        return {
          id: doc.$id,
          username: doc.username,
          avatarUrl,
          bio: doc.bio,
          followersCount: doc.followersCount || 0,
          followingCount: doc.followingCount || 0,
          profileBg: backgroundUrl,
          metadata: doc.metadata,
        };
      } catch (error) {
        console.error("Error fetching viewed profile:", error);
        return null;
      }
    },
    []
  );

  return { fetchProfile, getUserProfileData };
}
