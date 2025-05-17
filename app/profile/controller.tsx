import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { Models } from "react-native-appwrite";
import { ProfileData } from "@/redux/slices/profileSlice";
import { useFieldState } from "@/hooks/useFieldState";
import { fetchAllDocuments, safeFetch } from "@/utility/fetchUtils";

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

  const { setFieldState } = profile;

  const fetchPostsByUser = async (user: ProfileData) => {
    if (!user?.id) return;

    setFieldState("postLoading", true);

    try {
      const [recipesRes, postsRes] = await Promise.all([
        safeFetch(() =>
          fetchAllDocuments(AppwriteConfig.RECIPES_COLLECTION_ID)
        ),
        safeFetch(() => fetchAllDocuments(AppwriteConfig.POSTS_COLLECTION_ID)),
      ]);

      const recipes = recipesRes
        .filter((doc) => doc.author_id === user.id)
        .map((doc) => ({ ...doc, type: "recipe" }));

      const tipsAndDiscussions = postsRes.filter(
        (doc) => doc.author_id === user.id
      );

      setFieldState("posts", [...recipes, ...tipsAndDiscussions]);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setFieldState("postLoading", false);
    }
  };

  return {
    profile,
    fetchPostsByUser,
  };
};

export default useProfileController;
