import { Post } from "@/components/PostCard";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { useFieldState } from "@/hooks/useFieldState";
import { ProfileData } from "@/redux/slices/profileSlice";
import { fetchAllDocuments } from "@/services/Appwrite";
import { getImageUrl } from "@/utility/imageUtils";
import { parseMetadata } from "@/utility/metadataUtils";
import { useMemo } from "react";
import { Query } from "react-native-appwrite";
import { mainTabs, subTabs } from "./component";

export interface ProfileState {
  activeTab: (typeof mainTabs)[number];
  posts: Post[];
  likedPosts: Post[];
  bookmarkedPosts: Post[];
  subTab: (typeof subTabs)[number];
  postLoading: boolean;
  viewedProfileData: ProfileData | null;
}

export const useProfileController = () => {
  const profile = useFieldState<ProfileState>({
    activeTab: "Posts",
    posts: [],
    likedPosts: [],
    bookmarkedPosts: [],
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
      const [recipesRes, postsRes, interactionsRes] = await Promise.all([
        fetchAllDocuments(AppwriteConfig.RECIPES_COLLECTION_ID),
        fetchAllDocuments(AppwriteConfig.POSTS_COLLECTION_ID),
        fetchAllDocuments(AppwriteConfig.INTERACTIONS_COLLECTION_ID, [
          Query.equal("user_id", userId),
        ]),
      ]);

      const formatPost = (doc: any, type?: string) => ({
        ...doc,
        id: doc.$id,
        image: getImageUrl(doc.image?.[0]),
        ...(type && { type }),
      });

      const likedIds = new Set(
        interactionsRes.filter((i) => i.type === "like").map((i) => i.post_id)
      );
      const bookmarkedIds = new Set(
        interactionsRes
          .filter((i) => i.type === "bookmark")
          .map((i) => i.post_id)
      );

      const recipes = recipesRes
        .filter((doc) => doc.author_id === userId)
        .map((doc) => formatPost(doc, "recipe"));

      const tipsAndDiscussions = postsRes
        .filter((doc) => doc.author_id === userId)
        .map((doc) => formatPost(doc));

      const allPosts = [
        ...recipesRes.map((r) => formatPost(r, "recipe")),
        ...postsRes.map((p) => formatPost(p)),
      ];
      const likedPosts = allPosts.filter((post) => likedIds.has(post.id));
      const bookmarkPosts = allPosts.filter((post) =>
        bookmarkedIds.has(post.id)
      );

      setFieldState("posts", [...recipes, ...tipsAndDiscussions]);
      setFieldState("likedPosts", likedPosts);
      setFieldState("bookmarkedPosts", bookmarkPosts);
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
