import { AppwriteConfig } from "@/constants/AppwriteConfig";
import {
  createDocument,
  deleteDocument,
  getCurrentUser,
} from "@/services/appwrite";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

type InteractionType = "like" | "bookmark" | "follow";

export type InteractionResult = {
  isLiked: boolean;
  likeDocId?: string;
  isBookmarked: boolean;
  bookmarkDocId?: string;
  isFollowing: boolean;
  followDocId?: string;
};

export function useInteraction(
  targetId: string,
  initial?: Partial<InteractionResult>
) {
  const [state, setState] = useState<InteractionResult>({
    isLiked: initial?.isLiked ?? false,
    likeDocId: initial?.likeDocId,
    isBookmarked: initial?.isBookmarked ?? false,
    bookmarkDocId: initial?.bookmarkDocId,
    isFollowing: initial?.isFollowing ?? false,
    followDocId: initial?.followDocId,
  });

  useEffect(() => {
    if (!initial) return;
    setState((prev) => ({ ...prev, ...initial }));
  }, [initial]);

  const toggle = async (type: InteractionType) => {
    try {
      const currentUser = await getCurrentUser();
      const collectionId = AppwriteConfig.INTERACTIONS_COLLECTION_ID;

      const keyMap = {
        like: {
          flag: state.isLiked,
          docId: state.likeDocId,
          update: (flag: boolean, id?: string) =>
            setState((prev) => ({ ...prev, isLiked: flag, likeDocId: id })),
        },
        bookmark: {
          flag: state.isBookmarked,
          docId: state.bookmarkDocId,
          update: (flag: boolean, id?: string) =>
            setState((prev) => ({
              ...prev,
              isBookmarked: flag,
              bookmarkDocId: id,
            })),
        },
        follow: {
          flag: state.isFollowing,
          docId: state.followDocId,
          update: (flag: boolean, id?: string) =>
            setState((prev) => ({
              ...prev,
              isFollowing: flag,
              followDocId: id,
            })),
        },
      };

      const { flag, docId, update } = keyMap[type];

      if (flag && docId) {
        await deleteDocument(collectionId, docId);
        update(false, undefined);

        if (type !== "follow") {
          Toast.show({
            type: "success",
            text1: `Removed from ${type === "like" ? "Likes" : "Bookmarks"}`,
          });
        }
      } else {
        const newDoc = await createDocument(collectionId, {
          user_id: currentUser.$id,
          item_id: targetId,
          type,
          created_at: new Date().toISOString(),
        });

        update(true, newDoc.$id);

        if (type !== "follow") {
          Toast.show({
            type: "success",
            text1: `Added to ${type === "like" ? "Likes" : "Bookmarks"}`,
          });
        }
      }
    } catch (error) {
      console.warn("Interaction toggle failed:", error);
    }
  };

  return {
    isLiked: state.isLiked,
    isBookmarked: state.isBookmarked,
    isFollowing: state.isFollowing,
    toggleLike: () => toggle("like"),
    toggleBookmark: () => toggle("bookmark"),
    toggleFollow: () => toggle("follow"),
  };
}
