import { Post } from "@/components/PostCard";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { useFieldState } from "@/hooks/useFieldState";
import { getCurrentUser, getDocumentById } from "@/services/appwrite";
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

    const user = await getCurrentUser();
    const userDoc = await getDocumentById(
      AppwriteConfig.USERS_COLLECTION_ID,
      user.$id
    );

    const regionPref = userDoc?.region_pref;
    const posts = await fetchPosts(100, regionPref);

    setFields({
      posts,
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
