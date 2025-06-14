import { Post } from "@/components/PostCard";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { useFieldState } from "@/hooks/useFieldState";
import { ProfileData } from "@/redux/slices/profileSlice";
import { fetchAllDocuments } from "@/services/appwrite";
import { getImageUrl } from "@/utility/imageUtils";
import { parseMetadata } from "@/utility/metadataUtils";
import { useMemo } from "react";
import { mainTabs, subTabs } from "./component";

export interface ProfileState {
  activeTab: (typeof mainTabs)[number];
  posts: Post[];
  subTab: (typeof subTabs)[number];
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

  const { viewedProfileData, setFieldState } = profile;

  const metadata = useMemo(
    () => parseMetadata(viewedProfileData?.metadata),
    [viewedProfileData]
  );
  const isBackgroundDark = metadata?.profileBg?.isDark ?? false;

  const fetchPostsByUser = async (userId: string) => {
    if (!userId) return;

    setFieldState("postLoading", true);

    try {
      const [recipesRes, postsRes] = await Promise.all([
        fetchAllDocuments(AppwriteConfig.RECIPES_COLLECTION_ID),
        fetchAllDocuments(AppwriteConfig.POSTS_COLLECTION_ID),
      ]);

      const formatPost = (doc: any, type?: string) => ({
        ...doc,
        id: doc.$id,
        image: getImageUrl(doc.image?.[0]),
        ...(type && { type }),
      });

      const recipes = recipesRes
        .filter((doc) => doc.author_id === userId)
        .map((doc) => formatPost(doc, "recipe"));

      const tipsAndDiscussions = postsRes
        .filter((doc) => doc.author_id === userId)
        .map((doc) => formatPost(doc));

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
    isBackgroundDark,
  };
};

export default useProfileController;
