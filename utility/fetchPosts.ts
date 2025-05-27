import { Post } from "@/components/PostCard";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { fetchAllDocuments } from "@/services/appwrite";
import { getImageUrl } from "./imageUtils";
import { fetchUsers } from "./userCacheUtils";

export interface User {
  id: string;
  name: string;
  profilePic?: string;
  bio?: string;
}

export async function fetchPosts(limit?: number): Promise<Post[]> {
  const shuffleArray = <T>(array: T[]): T[] =>
    array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

  const applyLimit = <T>(arr: T[]): T[] => (limit ? arr.slice(0, limit) : arr);

  try {
    const [postDocs, recipeDocs, communityDocs] = await Promise.all([
      fetchAllDocuments(AppwriteConfig.POSTS_COLLECTION_ID),
      fetchAllDocuments(AppwriteConfig.RECIPES_COLLECTION_ID),
      fetchAllDocuments(AppwriteConfig.COMMUNITIES_COLLECTION_ID),
    ]);

    const authorIds = Array.from(
      new Set(
        [...postDocs, ...recipeDocs].map((doc) => doc.author_id).filter(Boolean)
      )
    );

    const usersMap = await fetchUsers(authorIds);

    const mapPost = (doc: any): Post => {
      const author = usersMap.get(doc.author_id);
      return {
        id: doc.$id,
        type: doc.type || "recipe",
        title: doc.title,
        image: getImageUrl(doc.image?.[0]),
        author: author?.name || "Unknown",
        profilePic: author?.profilePic,
      };
    };

    const recipes = applyLimit(shuffleArray(recipeDocs.map(mapPost)));
    const tips = applyLimit(
      shuffleArray(postDocs.filter((d) => d.type === "tip").map(mapPost))
    );
    const discussions = applyLimit(
      shuffleArray(postDocs.filter((d) => d.type === "discussion").map(mapPost))
    );
    const communities: Post[] = applyLimit(
      shuffleArray(
        communityDocs.map((doc) => ({
          id: doc.$id,
          type: "community" as const,
          title: doc.name,
          image: getImageUrl(doc.image),
          membersCount: doc.members_count,
          recipesCount: doc.recipes_count,
        }))
      )
    );

    return [...recipes, ...tips, ...discussions, ...communities];
  } catch (error) {
    console.error("Failed to fetch posts", error);
    return [];
  }
}

export async function fetchUserList(): Promise<User[]> {
  try {
    const userDocs = await fetchAllDocuments(
      AppwriteConfig.USERS_COLLECTION_ID
    );

    return userDocs.map((doc) => ({
      id: doc.$id,
      name: doc.username,
      profilePic: getImageUrl(doc.avatar),
      bio: doc.bio,
    }));
  } catch (error) {
    console.error("Failed to fetch user list", error);
    return [];
  }
}
