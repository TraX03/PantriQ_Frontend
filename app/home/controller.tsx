import { Post } from "@/components/PostCard";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { useFieldState } from "@/hooks/useFieldState";
import { fetchAllDocuments } from "@/services/appwrite";
import { getImageUrl } from "@/utility/imageUtils";
import { fetchUsers } from "@/utility/userCacheUtils";
import { useCallback } from "react";

export interface HomeState {
  activeTab: "Follow" | "Explore";
  activeSuggestion: string;
  posts: Post[];
  refreshing: boolean;
}

export const SUGGESTIONS = [
  "Recipe",
  "Tips & Advice",
  "Communities",
  "Discussions",
];

export const useHomeController = () => {
  const home = useFieldState<HomeState>({
    activeTab: "Explore",
    activeSuggestion: "Recipe",
    posts: [],
    refreshing: false,
  });

  const { activeSuggestion, setFieldState, refreshing, posts, setFields } =
    home;

  const fetchPosts = useCallback(async (): Promise<Post[]> => {
    // Fisher-Yates Shuffle for randomness
    const shuffleArray = <T,>(array: T[]): T[] =>
      array
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    try {
      const [postDocs, recipeDocs, communityDocs] = await Promise.all([
        fetchAllDocuments(AppwriteConfig.POSTS_COLLECTION_ID),
        fetchAllDocuments(AppwriteConfig.RECIPES_COLLECTION_ID),
        fetchAllDocuments(AppwriteConfig.COMMUNITIES_COLLECTION_ID),
      ]);

      const authorIds = Array.from(
        new Set(
          [...postDocs, ...recipeDocs]
            .map((doc) => doc.author_id)
            .filter(Boolean)
        )
      );

      const usersMap = await fetchUsers(authorIds);

      const mapPost = (doc: any): Post => {
        const author = usersMap.get(doc.author_id);
        return {
          id: doc.$id,
          type: doc.type || "recipe",
          title: doc.title,
          image: getImageUrl(doc.image?.[0]),
          author: author?.name || "Unknown",
          profilePic: author?.profilePic,
        };
      };

      const recipes = shuffleArray(recipeDocs.map(mapPost)).slice(0, 100);
      const tips = shuffleArray(
        postDocs.filter((d) => d.type === "tip").map(mapPost)
      ).slice(0, 100);
      const discussions = shuffleArray(
        postDocs.filter((d) => d.type === "discussion").map(mapPost)
      ).slice(0, 100);

      const communities: Post[] = shuffleArray(
        communityDocs.map((doc) => ({
          id: doc.$id,
          type: "community" as const,
          title: doc.name,
          image: getImageUrl(doc.image),
          membersCount: doc.members_count,
          recipesCount: doc.recipes_count,
        }))
      ).slice(0, 100);

      return [...recipes, ...tips, ...discussions, ...communities];
    } catch (error) {
      console.error("Failed to fetch home posts", error);
      return [];
    }
  }, []);

  const refreshPosts = useCallback(async () => {
    setFieldState("refreshing", true);
    const fetchedPosts = await fetchPosts();
    setFields({
      posts: fetchedPosts,
      refreshing: false,
    });
  }, [fetchPosts]);

  const filterPosts = useCallback(
    (posts: Post[], suggestion: string): Post[] => {
      const typeMap: Record<string, Post["type"]> = {
        Recipe: "recipe",
        "Tips & Advice": "tips",
        Communities: "community",
        Discussions: "discussion",
      };
      return posts.filter((post) => post.type === typeMap[suggestion]);
    },
    []
  );

  const filteredPosts = filterPosts(posts, activeSuggestion);

  return {
    home,
    suggestions: SUGGESTIONS,
    filteredPosts,
    refreshing,
    onRefresh: refreshPosts,
  };
};

export default useHomeController;
