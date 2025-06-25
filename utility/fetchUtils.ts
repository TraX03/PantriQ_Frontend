import { Post } from "@/components/PostCard";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { fetchAllDocuments } from "@/services/Appwrite";
import { fetchHomeFeedRecommendations } from "@/services/FastApi";
import { getImageUrl } from "./imageUtils";
import { fetchUsers } from "./userCacheUtils";

export interface User {
  id: string;
  name: string;
  profilePic?: string;
  bio?: string;
}

export const fetchPosts = async (
  limit?: number,
  regionPref?: string,
  includeRecipes: boolean = false
): Promise<Post[]> => {
  const shuffleArray = <T>(array: T[]): T[] =>
    array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

  const applyLimit = <T>(arr: T[], lim?: number): T[] =>
    lim ? arr.slice(0, lim) : arr;

  const mapPost = (doc: any, usersMap: Map<string, any>): Post => {
    const author = usersMap.get(doc.author_id);
    return {
      id: doc.$id,
      type: doc.type || "recipe",
      title: doc.title,
      image: getImageUrl(doc.image?.[0]),
      author: author?.username || "Unknown",
      profilePic: author?.avatarUrl,
      area: doc.area,
      created_at: doc.$createdAt,
    };
  };

  const mapCommunity = (doc: any): Post => ({
    id: doc.$id,
    type: "community",
    title: doc.name,
    image: getImageUrl(doc.image),
    membersCount: doc.members_count,
    recipesCount: doc.recipes_count,
    created_at: doc.$createdAt,
  });

  try {
    const [postDocs, communityDocs] = await Promise.all([
      fetchAllDocuments(AppwriteConfig.POSTS_COLLECTION_ID),
      fetchAllDocuments(AppwriteConfig.COMMUNITIES_COLLECTION_ID),
    ]);

    const recipeDocs = includeRecipes
      ? await fetchAllDocuments(AppwriteConfig.RECIPES_COLLECTION_ID)
      : [];

    const authorIds = Array.from(
      new Set(
        [...postDocs, ...(includeRecipes ? recipeDocs : [])]
          .map((doc) => doc.author_id)
          .filter(Boolean)
      )
    );

    const usersMap = await fetchUsers(authorIds);

    const tips = applyLimit(
      shuffleArray(
        postDocs
          .filter((d) => d.type === "tips")
          .map((d) => mapPost(d, usersMap))
      )
    );

    const discussions = applyLimit(
      shuffleArray(
        postDocs
          .filter((d) => d.type === "discussion")
          .map((d) => mapPost(d, usersMap))
      )
    );

    const communities = applyLimit(
      shuffleArray(communityDocs.map(mapCommunity))
    );

    let finalRecipes: Post[] = [];
    if (includeRecipes) {
      const allRecipes = recipeDocs.map((d) => mapPost(d, usersMap));

      const regionRecipes = regionPref
        ? allRecipes.filter((r) => regionPref.includes(r.area || ""))
        : [];
      const otherRecipes = regionPref
        ? allRecipes.filter((r) => !regionPref.includes(r.area || ""))
        : allRecipes;

      const halfLimit = limit
        ? Math.floor(limit / 2)
        : Math.floor(allRecipes.length / 2);
      const regionHalf = applyLimit(shuffleArray(regionRecipes), halfLimit);
      const otherHalf = applyLimit(
        shuffleArray(otherRecipes),
        limit ? limit - regionHalf.length : undefined
      );

      finalRecipes = [...regionHalf, ...otherHalf];
    }

    return [...finalRecipes, ...tips, ...discussions, ...communities];
  } catch (error) {
    console.error("Failed to fetch posts", error);
    return [];
  }
};

export const fetchHomeFeedPosts = async (userId: string): Promise<Post[]> => {
  try {
    const recs = await fetchHomeFeedRecommendations(userId);

    const authorIds = Array.from(
      new Set((recs.author_ids as string[]).filter(Boolean))
    );
    const usersMap = await fetchUsers(authorIds);

    return recs.recipe_ids.map((id: string, index: number) => {
      const authorId = recs.author_ids[index];
      const authorInfo = usersMap.get(authorId);
      return {
        id,
        type: "recipe",
        title: recs.titles[index],
        image: getImageUrl(recs.images[index]),
        author: authorInfo?.username || "Unknown",
        profilePic: getImageUrl(authorInfo?.avatarUrl),
      };
    });
  } catch (err) {
    console.error("Failed to fetch home feed", err);
    return [];
  }
};

export const fetchUserList = async (): Promise<User[]> => {
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
};
