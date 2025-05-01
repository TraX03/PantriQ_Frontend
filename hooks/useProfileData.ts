import { useCallback, useEffect } from "react";
import { account, databases, storage } from "@/services/appwrite";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { ProfileActions } from "@/utility/profile/actions";
import { useAuth } from "@/context/AuthContext";
import reactotron from "reactotron-react-native";
import { useLoading } from "@/context/LoadingContext";

const guestProfile = {
  username: "Guest",
  avatarUrl: storage.getFileView(
    AppwriteConfig.BUCKET_ID,
    "680778f2002d348f9b72"
  ).href,
  followersCount: 0,
  followingCount: 0,
};

export function useProfileData() {
  const { profileData, setFieldState } = ProfileActions();
  const { isLoggedIn } = useAuth();
  const { setLoading } = useLoading();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
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
      }

      const mappedProfileData = {
        username: userData.username,
        avatarUrl: avatarUrl,
        bio: userData.bio,
        gender: userData.gender,
        birthday: userData.birthday
          ? new Date(userData.birthday).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "",
        phone: userData.phone,
        email: user.email,
        followersCount: userData.followers_count,
        followingCount: userData.following_count,
      };

      reactotron.log(mappedProfileData);
      setFieldState("profileData", mappedProfileData);
    } catch (error) {
      reactotron.log("Failed to fetch user profile.", { error });
      setFieldState("profileData", guestProfile);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [isLoggedIn]);

  return { profileData, fetchProfile };
}
