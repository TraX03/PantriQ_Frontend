import { useEffect } from "react";
import { account, databases, storage } from "@/services/appwrite";
import { appwriteConfig } from "@/constants/appwriteConfig";
import { ProfileActions } from "@/features/profile/actions";
import { useAuth } from "@/features/authentication/context";
import reactotron from "reactotron-react-native";

const guestProfile = {
  username: "Guest",
  avatarUrl: storage.getFileView(
    appwriteConfig.BUCKET_ID,
    "680778f2002d348f9b72"
  ).href,
  followers_count: 0,
  following_count: 0,
};

export function useProfileData() {
  const { profileData, loading, setFieldState } = ProfileActions();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      setFieldState("loading", true);
      try {
        const user = await account.get();

        if (!user) {
          reactotron.log("No user found. Treating as guest.");
          setFieldState("profileData", guestProfile);
          return;
        }

        const userData = await databases.getDocument(
          appwriteConfig.DATABASE_ID,
          appwriteConfig.USERS_COLLECTION_ID,
          user.$id
        );

        let avatarUrl: string | undefined;
        if (userData.avatar) {
          try {
            avatarUrl = storage.getFileView(
              appwriteConfig.BUCKET_ID,
              userData.avatar
            ).href;
          } catch (avatarError) {
            reactotron.log("Failed to generate avatar URL.", {
              avatarError,
            });
          }
        } else {
          reactotron.log("No avatar found for user.");
        }

        setFieldState("profileData", {
          ...userData,
          avatarUrl,
        });
      } catch (error) {
        reactotron.error("Failed to fetch user profile.", { error });
        setFieldState("profileData", guestProfile);
      } finally {
        setFieldState("loading", false);
      }
    };

    fetchProfile();
  }, [isLoggedIn]);

  return { profileData, loading };
}
