import { Post } from "@/components/PostCard";
import { useFieldState } from "@/hooks/useFieldState";
import { fetchPosts, fetchUserList, User } from "@/utility/fetchUtils";
import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
} from "@/utility/searchStorageUtils";
import Fuse from "fuse.js";

export const searchModeOptions = [
  { id: "default", label: "Default" },
  { id: "ingredient", label: "Ingredient" },
  { id: "area", label: "Region" },
] as const;

export type SearchMode = (typeof searchModeOptions)[number]["id"];

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
  searchMode: SearchMode;
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
    searchMode: "default",
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

  const handleSearch = async (
    term?: string,
    isMealtime = false,
    mode: SearchMode = "default"
  ) => {
    const query = (term ?? searchText).trim().toLowerCase();
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

    if (!isMealtime) {
      await addRecentSearch(query);
      const recent = await getRecentSearches();
      setFieldState("recentSearches", recent);
    }

    const recipePosts = posts.filter((post) => post.type === "recipe");
    const otherPosts = posts.filter((post) => post.type !== "recipe");

    let filteredRecipes: typeof posts = [];
    if (isMealtime) {
      filteredRecipes = recipePosts.filter((post) => {
        const mealtimeRaw = post.mealtime as string | string[] | undefined;

        const mealtimes: string[] = Array.isArray(mealtimeRaw)
          ? mealtimeRaw.map((m) =>
              typeof m === "string" ? m.toLowerCase() : ""
            )
          : typeof mealtimeRaw === "string"
          ? [mealtimeRaw.toLowerCase()]
          : [];

        return (
          mealtimes.includes(query.toLowerCase()) || mealtimes.includes("all")
        );
      });
    } else if (mode === "area") {
      filteredRecipes = recipePosts.filter((post) => {
        const area = post.area?.toLowerCase?.() ?? "";
        return area.includes(query.toLowerCase());
      });
    }

    const fuzzyTargetPosts = isMealtime || mode === "area" ? otherPosts : posts;

    const postKeys =
      mode === "ingredient"
        ? [
            { name: "ingredients", weight: 1 },
            { name: "title", weight: 0.5 },
          ]
        : [
            { name: "title", weight: 0.58 },
            { name: "ingredients", weight: 0.25 },
            { name: "category", weight: 0.1 },
            { name: "description", weight: 0.07 },
          ];

    const postFuse = new Fuse(fuzzyTargetPosts, {
      includeScore: true,
      threshold: 0.3,
      ignoreLocation: true,
      keys: postKeys,
    });

    const postFuzzyResults = postFuse
      .search(query)
      .sort((a, b) => (a.score ?? 1) - (b.score ?? 1))
      .map((res) => res.item);

    const userFuse = new Fuse(users, {
      includeScore: true,
      threshold: 0.3,
      ignoreLocation: true,
      keys: [
        { name: "name", weight: 0.7 },
        { name: "bio", weight: 0.3 },
      ],
    });

    const userResults = userFuse
      .search(query)
      .sort((a, b) => (a.score ?? 1) - (b.score ?? 1))
      .map((res) => res.item);

    const allFilteredPosts =
      isMealtime || mode === "area"
        ? [...filteredRecipes, ...postFuzzyResults]
        : postFuzzyResults;

    setFields({
      allFilteredPosts,
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
