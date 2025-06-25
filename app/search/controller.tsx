import { Post } from "@/components/PostCard";
import { useFieldState } from "@/hooks/useFieldState";
import { fetchPosts, fetchUserList, User } from "@/utility/fetchUtils";
import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
} from "@/utility/searchStorageUtils";
import Fuse from "fuse.js";

export interface SearchState {
  posts: Post[];
  users: User[];
  filteredPosts: Post[];
  filteredUsers: User[];
  searchText: string;
  hasSearched: boolean;
  recentSearches: string[];
  expanded: boolean;
}

const useSearchController = () => {
  const search = useFieldState<SearchState>({
    posts: [],
    users: [],
    filteredPosts: [],
    filteredUsers: [],
    searchText: "",
    hasSearched: false,
    recentSearches: [],
    expanded: false,
  });

  const { posts, searchText, setFieldState, setFields } = search;

  const init = async () => {
    const recent = getRecentSearches();
    setFieldState("recentSearches", recent);

    const [postData, userData] = await Promise.all([
      fetchPosts(undefined, undefined, true),
      fetchUserList(),
    ]);

    setFields({
      posts: postData,
      users: userData,
      filteredPosts: postData,
      filteredUsers: userData,
    });
  };

  const handleSearch = async (term?: string) => {
    const query = (term ?? searchText).trim();
    if (!query) return;

    await updateRecentSearches(query);

    const postFuse = new Fuse(posts, {
      keys: ["title", "description"],
      threshold: 0.3,
    });

    const userFuse = new Fuse(search.users, {
      keys: ["name", "bio"],
      threshold: 0.3,
    });

    const postResults = postFuse.search(query).map((r) => r.item);
    const userResults = userFuse.search(query).map((r) => r.item);

    setFields({
      filteredPosts: postResults,
      filteredUsers: userResults,
      searchText: query,
      hasSearched: true,
    });
  };

  const updateRecentSearches = async (query: string) => {
    await addRecentSearch(query);
    const recent = await getRecentSearches();
    setFieldState("recentSearches", recent);
  };

  const handleClear = async () => {
    await clearRecentSearches();
    setFieldState("recentSearches", []);
  };

  return {
    search,
    handleSearch,
    handleClear,
    init,
  };
};

export default useSearchController;
