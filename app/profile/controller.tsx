import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { useFieldState } from "@/hooks/useFieldState";
import { ProfileData } from "@/redux/slices/profileSlice";
import { fetchAllDocuments } from "@/services/appwrite";
import { Models } from "react-native-appwrite";

export interface ProfileState {
  activeTab: "Posts" | "Collections" | "Likes";
  posts: Models.Document[];
  subTab: "Recipe" | "Tips" | "Discussion";
  postLoading: boolean;
}

export const useProfileController = () => {
  const profile = useFieldState<ProfileState>({
    activeTab: "Posts",
    posts: [],
    subTab: "Recipe",
    postLoading: false,
  });

  const fetchPostsByUser = async (user: ProfileData) => {
    if (!user?.id) return;

    profile.setFieldState("postLoading", true);

    try {
      const [recipesRes, postsRes] = await Promise.all([
        fetchAllDocuments(AppwriteConfig.RECIPES_COLLECTION_ID),
        fetchAllDocuments(AppwriteConfig.POSTS_COLLECTION_ID),
      ]);

      const recipes = recipesRes
        .filter((doc) => doc.author_id === user.id)
        .map((doc) => ({ ...doc, type: "recipe" }));

      const tipsAndDiscussions = postsRes.filter(
        (doc) => doc.author_id === user.id
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
  };
};

export default useProfileController;
