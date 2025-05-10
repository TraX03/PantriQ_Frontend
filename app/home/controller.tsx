import { Post } from "@/components/PostCard";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { databases, storage } from "@/services/appwrite";
import { Query } from "react-native-appwrite";
import { useFieldState } from "@/hooks/useFieldState";
import { useEffect, useCallback } from "react";
import { mockPosts } from "@/data/mockPosts";

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
      const postRes = await databases.listDocuments(
        AppwriteConfig.DATABASE_ID,
        AppwriteConfig.POSTS_COLLECTION_ID
      );

      const postsRaw = postRes.documents;

      if (postsRaw.length === 0) {
        return [];
      }

      const authorIds = [...new Set(postsRaw.map((doc) => doc.author_id))];

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

      return postsRaw.map((doc) => {
        const author = usersMap.get(doc.author_id);

        return {
          id: doc.$id,
          type: doc.type,
          title: doc.title,
          image: storage.getFileView(AppwriteConfig.BUCKET_ID, doc.image).href,
          author: author?.name,
          profilePic: storage.getFileView(
            AppwriteConfig.BUCKET_ID,
            author?.profilePic
          ).href,
        };
      });
    } catch (error) {
      console.error("Failed to fetch home posts", error);
      return [];
    }
  }, []);

  const refreshPosts = useCallback(async () => {
    setFieldState("refreshing", true);
    try {
      // const fetchedPosts = await fetchPosts();
      // setFieldState("posts", fetchedPosts);

      setFieldState("posts", mockPosts);
    } catch (error) {
      console.error("Error refreshing posts:", error);
    } finally {
      setFieldState("refreshing", false);
    }
  }, []);

  const filterPosts = useCallback(
    (posts: Post[], activeSuggestion: string): Post[] => {
      return posts.filter((post) => {
        switch (activeSuggestion) {
          case "Recipe":
            return post.type === "recipe";
          case "Tips & Advice":
            return post.type === "tips";
          case "Communities":
            return post.type === "community";
          case "Discussions":
            return post.type === "discussion";
          default:
            return true;
        }
      });
    },
    []
  );

  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  // const filteredPosts = filterPosts(posts, activeSuggestion);
  const filteredPosts = filterPosts(mockPosts, activeSuggestion);

  return {
    home,
    suggestions: SUGGESTIONS,
    filteredPosts,
    refreshing,
    onRefresh: refreshPosts,
  };
};

export default useHomeController;
