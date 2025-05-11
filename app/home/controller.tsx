import { Post } from "@/components/PostCard";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { databases, storage } from "@/services/appwrite";
import { Query } from "react-native-appwrite";
import { useFieldState } from "@/hooks/useFieldState";
import { useEffect, useCallback } from "react";
import { fetchSampleMeals } from "@/services/MealDbApi";

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

  const { activeSuggestion, setFieldState, refreshing, posts } = home;

  const fetchPosts = useCallback(async (): Promise<Post[]> => {
    try {
      // Fetch posts (recipe, tips, discussion)
      const postRes = await databases.listDocuments(
        AppwriteConfig.DATABASE_ID,
        AppwriteConfig.POSTS_COLLECTION_ID
      );
      const postsRaw = postRes.documents;

      // Fetch user info
      const authorIds = [
        ...new Set(postRes.documents.map((doc) => doc.author_id)),
      ];
      const usersRes = await databases.listDocuments(
        AppwriteConfig.DATABASE_ID,
        AppwriteConfig.USERS_COLLECTION_ID,
        [Query.equal("$id", authorIds)]
      );

      const usersMap = new Map(
        usersRes.documents.map((user) => [
          user.$id,
          {
            name: user.username,
            profilePic: user.avatar,
          },
        ])
      );

      const appwritePosts: Post[] = postsRaw.map((doc) => {
        const author = usersMap.get(doc.author_id);
        return {
          id: doc.$id,
          type: doc.type,
          title: doc.title,
          image: storage.getFileView(AppwriteConfig.BUCKET_ID, doc.image[0])
            .href,
          author: author?.name,
          profilePic: storage.getFileView(
            AppwriteConfig.BUCKET_ID,
            author?.profilePic
          ).href,
        };
      });

      // Fetch community posts
      const communityRes = await databases.listDocuments(
        AppwriteConfig.DATABASE_ID,
        AppwriteConfig.COMMUNITIES_COLLECTION_ID
      );

      const communityPosts: Post[] = communityRes.documents.map((doc) => ({
        id: doc.$id,
        type: "community",
        title: doc.name,
        image: storage.getFileView(AppwriteConfig.BUCKET_ID, doc.image).href,
        membersCount: doc.members_count,
        recipesCount: doc.recipes_count,
      }));

      // Sample meals
      const mealPosts = await fetchSampleMeals();

      return [...appwritePosts, ...communityPosts, ...mealPosts];
    } catch (error) {
      console.error("Failed to fetch home posts", error);
      return [];
    }
  }, []);

  const refreshPosts = useCallback(async () => {
    setFieldState("refreshing", true);
    const fetchedPosts = await fetchPosts();
    setFieldState("posts", fetchedPosts);
    setFieldState("refreshing", false);
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

  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  return {
    home,
    suggestions: SUGGESTIONS,
    filteredPosts,
    refreshing,
    onRefresh: refreshPosts,
  };
};

export default useHomeController;
