import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { useFieldState } from "@/hooks/useFieldState";
import { ProfileData } from "@/redux/slices/profileSlice";
import { fetchAllDocuments } from "@/services/appwrite";
import { parseMetadata } from "@/utility/metadataUtils";
import { useMemo } from "react";
import { Models } from "react-native-appwrite";

export interface ProfileState {
  activeTab: "Posts" | "Collections" | "Likes";
  posts: Models.Document[];
  subTab: "Recipe" | "Tips" | "Discussion";
  postLoading: boolean;
  viewedProfileData: ProfileData | null;
}

export const useProfileController = () => {
  const profile = useFieldState<ProfileState>({
    activeTab: "Posts",
    posts: [],
    subTab: "Recipe",
    postLoading: false,
    viewedProfileData: null,
  });

  const metadata = useMemo(
    () => parseMetadata(profile.viewedProfileData?.metadata),
    [profile.viewedProfileData]
  );
  const isBackgroundDark = metadata?.profileBg?.isDark ?? false;

  const fetchPostsByUser = async (userId: string) => {
    if (!userId) return;

    profile.setFieldState("postLoading", true);

    try {
      const [recipesRes, postsRes] = await Promise.all([
        fetchAllDocuments(AppwriteConfig.RECIPES_COLLECTION_ID),
        fetchAllDocuments(AppwriteConfig.POSTS_COLLECTION_ID),
      ]);

      const recipes = recipesRes
        .filter((doc) => doc.author_id === userId)
        .map((doc) => ({ ...doc, type: "recipe" }));

      const tipsAndDiscussions = postsRes.filter(
        (doc) => doc.author_id === userId
      );

      profile.setFieldState("posts", [...recipes, ...tipsAndDiscussions]);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      profile.setFieldState("postLoading", false);
    }
  };

  return {
    profile,
    fetchPostsByUser,
    isBackgroundDark,
  };
};

export default useProfileController;
