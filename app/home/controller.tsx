import { Post } from "@/components/PostCard";
import { useFieldState } from "@/hooks/useFieldState";
import { fetchPosts } from "@/utility/fetchPosts";
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

  const refreshPosts = useCallback(async () => {
    setFieldState("refreshing", true);
    const fetchedPosts = await fetchPosts(100);
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
