import { AppwriteConfig } from "@/constants/AppwriteConfig";
import {
  createDocument,
  deleteDocument,
  getCurrentUser,
} from "@/services/appwrite";
import { useState } from "react";
import Toast from "react-native-toast-message";

type InteractionType = "like" | "bookmark";

export function useInteraction(
  postId: string,
  initial?: {
    isLiked?: boolean;
    likeDocId?: string;
    isBookmarked?: boolean;
    bookmarkDocId?: string;
  }
) {
  const [isLiked, setIsLiked] = useState(initial?.isLiked ?? false);
  const [likeDocId, setLikeDocId] = useState(initial?.likeDocId);
  const [isBookmarked, setIsBookmarked] = useState(
    initial?.isBookmarked ?? false
  );
  const [bookmarkDocId, setBookmarkDocId] = useState(initial?.bookmarkDocId);

  async function toggle(type: InteractionType) {
    try {
      const currentUser = await getCurrentUser();

      const isActive = type === "like" ? isLiked : isBookmarked;
      const docId = type === "like" ? likeDocId : bookmarkDocId;

      if (isActive && docId) {
        await deleteDocument(AppwriteConfig.INTERACTIONS_COLLECTION_ID, docId);

        if (type === "like") {
          setIsLiked(false);
          setLikeDocId(undefined);
        } else {
          setIsBookmarked(false);
          setBookmarkDocId(undefined);
        }

        Toast.show({
          type: "success",
          text1: `Removed from ${type === "like" ? "Likes" : "Bookmarks"}`,
        });
      } else {
        const newDoc = await createDocument(
          AppwriteConfig.INTERACTIONS_COLLECTION_ID,
          {
            user_id: currentUser.$id,
            item_id: postId,
            type,
            created_at: new Date().toISOString(),
          }
        );

        if (type === "like") {
          setIsLiked(true);
          setLikeDocId(newDoc.$id);
        } else {
          setIsBookmarked(true);
          setBookmarkDocId(newDoc.$id);
        }

        Toast.show({
          type: "success",
          text1: `Added to ${type === "like" ? "Likes" : "Bookmarks"}`,
        });
      }
    } catch (error) {
      console.warn("Interaction toggle failed:", error);
    }
  }

  return {
    isLiked,
    isBookmarked,
    toggleLike: () => toggle("like"),
    toggleBookmark: () => toggle("bookmark"),
  };
}
