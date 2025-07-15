import { Post } from "@/components/PostCard";
import { useFieldState } from "@/hooks/useFieldState";
import { getCurrentUser } from "@/services/Appwrite";
import { logHomeFeedSessionFeedback } from "@/services/FastApi";
import { fetchHomeFeedPosts, fetchPosts } from "@/utility/fetchUtils";
import { useCallback, useMemo } from "react";

export interface HomeState {
  activeTab: "Follow" | "Explore";
  activeSuggestion: string;
  posts: Post[];
  refreshing: boolean;
  hasLoadedOnce: boolean;
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
    hasLoadedOnce: false,
  });

  const {
    activeSuggestion,
    setFieldState,
    refreshing,
    posts,
    setFields,
    getFieldState,
  } = home;

  const refreshPosts = useCallback(async () => {
    setFieldState("refreshing", true);

    try {
      const user = await getCurrentUser().catch(() => {
        console.warn("No user");
        return null;
      });

      const latestHasLoadedOnce = getFieldState("hasLoadedOnce");

      if (user && latestHasLoadedOnce) {
        logHomeFeedSessionFeedback(user.$id);
      }

      const posts = user
        ? await fetchHomeFeedPosts(user.$id)
        : await fetchPosts();

      setFields({ posts, refreshing: false, hasLoadedOnce: true });
    } catch (error) {
      console.error("Failed to refresh posts:", error);
      setFieldState("refreshing", false);
    }
  }, []);

  const filterPosts = useCallback(
    (allPosts: Post[], suggestion: string): Post[] => {
      const typeMap: Record<string, Post["type"]> = {
        Recipe: "recipe",
        "Tips & Advice": "tips",
        Communities: "community",
        Discussions: "discussion",
      };
      return allPosts.filter((post) => post.type === typeMap[suggestion]);
    },
    []
  );

  const filteredPosts = useMemo(
    () => filterPosts(posts, activeSuggestion),
    [posts, activeSuggestion, filterPosts]
  );

  return {
    home,
    suggestions: SUGGESTIONS,
    filteredPosts,
    refreshing,
    onRefresh: refreshPosts,
  };
};

export default useHomeController;
