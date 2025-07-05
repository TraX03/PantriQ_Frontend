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
  allFilteredPosts: Post[];
  filteredUsers: User[];
  searchText: string;
  hasSearched: boolean;
  recentSearches: string[];
  expanded: boolean;
  postLoading: boolean;
  isInitialized: boolean;
}

const useSearchController = () => {
  const search = useFieldState<SearchState>({
    posts: [],
    users: [],
    allFilteredPosts: [],
    filteredUsers: [],
    searchText: "",
    hasSearched: false,
    recentSearches: [],
    expanded: false,
    postLoading: false,
    isInitialized: false,
  });

  const { searchText, setFieldState, setFields } = search;

  const init = async () => {
    const recent = await getRecentSearches();
    setFieldState("recentSearches", recent);

    const [posts, users] = await Promise.all([
      fetchPosts(false, false),
      fetchUserList(),
    ]);

    setFields({
      posts,
      users,
      allFilteredPosts: posts,
      filteredUsers: users,
      isInitialized: true,
    });

    return { posts, users };
  };

  const handleSearch = async (term?: string) => {
    const query = (term ?? searchText).trim();
    if (!query) return;

    setFields({
      searchText: query,
      postLoading: true,
      hasSearched: true,
    });

    let posts = search.posts;
    let users = search.users;

    if (!search.isInitialized) {
      const result = await init();
      posts = result.posts;
      users = result.users;
    }

    await addRecentSearch(query);
    const recent = await getRecentSearches();
    setFieldState("recentSearches", recent);

    const postResults = new Fuse(posts, {
      keys: ["title", "description", "area", "category", "ingredients"],
      threshold: 0.3,
    })
      .search(query)
      .map((res) => res.item);

    const userResults = new Fuse(users, {
      keys: ["name", "bio"],
      threshold: 0.3,
    })
      .search(query)
      .map((res) => res.item);

    setFields({
      allFilteredPosts: postResults,
      filteredUsers: userResults,
      postLoading: false,
    });
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
