import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { InteractionResult } from "@/hooks/useInteraction";
import { getCurrentUser, listDocuments } from "@/services/appwrite";
import { Query } from "react-native-appwrite";

export async function getUserInteractions(
  itemId: string
): Promise<InteractionResult> {
  const user = await getCurrentUser();

  const interactions = await listDocuments(
    AppwriteConfig.INTERACTIONS_COLLECTION_ID,
    [Query.equal("item_id", itemId), Query.equal("user_id", user.$id)]
  );

  const like = interactions.find((doc) => doc.type === "like");
  const bookmark = interactions.find((doc) => doc.type === "bookmark");
  const follow = interactions.find((doc) => doc.type === "follow");

  return {
    isLiked: !!like,
    likeDocId: like?.$id,
    isBookmarked: !!bookmark,
    bookmarkDocId: bookmark?.$id,
    isFollowing: !!follow,
    followDocId: follow?.$id,
  };
}
