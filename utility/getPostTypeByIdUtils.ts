import { PostType } from "@/components/PostCard";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { databases } from "@/services/appwrite";

async function safeGetDocument(collectionId: string, documentId: string) {
  try {
    return await databases.getDocument(
      AppwriteConfig.DATABASE_ID,
      collectionId,
      documentId
    );
  } catch (err: any) {
    if (err.code !== 404) throw err;
  }
}

export async function getPostTypeById(id: string): Promise<PostType | null> {
  const recipe = await safeGetDocument(
    AppwriteConfig.RECIPES_COLLECTION_ID,
    id
  );

  if (recipe) return "recipe";
  
  const post = await safeGetDocument(AppwriteConfig.POSTS_COLLECTION_ID, id);
  if (post?.type === "tips") return "tips";
  if (post?.type === "discussion") return "discussion";

  const community = await safeGetDocument(
    AppwriteConfig.COMMUNITIES_COLLECTION_ID,
    id
  );
  if (community) return "community";

  return null;
}
