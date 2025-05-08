import { Post } from "@/components/PostCard";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { databases, storage } from "@/services/appwrite";
import { Query } from "react-native-appwrite";

const HomeController = {
  async fetchPosts(): Promise<Post[]> {
    try {
      const postRes = await databases.listDocuments(
        AppwriteConfig.DATABASE_ID,
        AppwriteConfig.POSTS_COLLECTION_ID
      );

      const postsRaw = postRes.documents;
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
      console.error("Failed to fetch posts", error);
      return [];
    }
  },

  filterPosts(posts: Post[], activeSuggestion: string): Post[] {
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
};

export default HomeController;
