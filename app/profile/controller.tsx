import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { databases } from "@/services/appwrite";
import { Models, Query } from "react-native-appwrite";
import { ProfileData } from "@/redux/slices/profileSlice";
import { useFieldState } from "@/hooks/useFieldState";

export interface ProfileState {
  activeTab: string;
  posts: Models.Document[];
}

const ProfileController = {
  fetchPostsByUser: async (
    profileData: ProfileData,
    profile: ReturnType<typeof useFieldState<ProfileState>>
  ) => {
    if (!profileData?.id) return;

    const { setFieldState } = profile;

    try {
      const response = await databases.listDocuments(
        AppwriteConfig.DATABASE_ID,
        AppwriteConfig.POSTS_COLLECTION_ID,
        [Query.equal("author_id", [profileData.id])]
      );

      setFieldState("posts", response.documents);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  },
};

export default ProfileController;
