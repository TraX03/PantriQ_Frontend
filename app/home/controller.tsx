import { Post } from "@/components/PostCard";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { useFieldState } from "@/hooks/useFieldState";
import { getCurrentUser, getDocumentById } from "@/services/Appwrite";
import { fetchPosts } from "@/utility/fetchUtils";
import { useCallback, useMemo } from "react";

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
    let regionPref: string | undefined;

    try {
      const user = await getCurrentUser();

      if (user) {
        const userDoc = await getDocumentById(
          AppwriteConfig.USERS_COLLECTION_ID,
          user.$id
        );
        regionPref = userDoc?.region_pref;
      }
    } catch (error) {
      regionPref = undefined;
    }

    const fetchedPosts = await fetchPosts(100, regionPref);

    setFields({
      posts: fetchedPosts,
      refreshing: false,
    });
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
