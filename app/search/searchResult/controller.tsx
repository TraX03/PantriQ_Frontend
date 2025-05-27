import { Post } from "@/components/PostCard";
import { useFieldState } from "@/hooks/useFieldState";
import { isEqual } from "lodash";
import { useEffect } from "react";

export const tabs = [
  "Recipes",
  "Tips & Advice",
  "Discussions",
  "Communities",
  "Users",
] as const;

export type Tab = (typeof tabs)[number];

export interface SearchResultState {
  filterActive: boolean;
  orderActive: boolean;
  activeTab: Tab;
  filteredPosts: Post[];
}

const useSearchResultController = (posts: Post[]) => {
  const searchResult = useFieldState<SearchResultState>({
    filterActive: false,
    orderActive: false,
    activeTab: tabs[0],
    filteredPosts: [],
  });

  const { activeTab, filteredPosts, setFieldState } = searchResult;

  const getFilteredPostsByTab = () => {
    if (!posts) return [];

    return posts.filter((post) => {
      switch (activeTab) {
        case "Recipes":
          return post.type === "recipe";
        case "Tips & Advice":
          return post.type === "tips";
        case "Discussions":
          return post.type === "discussion";
        case "Communities":
          return post.type === "community";
        default:
          return false;
      }
    });
  };

  useEffect(() => {
    const filtered = getFilteredPostsByTab();
    if (!isEqual(filtered, filteredPosts)) {
      setFieldState("filteredPosts", filtered);
    }
  }, [posts, activeTab, filteredPosts, setFieldState]);

  return {
    searchResult,
  };
};

export default useSearchResultController;
