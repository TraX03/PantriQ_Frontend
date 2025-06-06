import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { updateProfileField } from "@/redux/slices/profileSlice";
import { AppDispatch } from "@/redux/store";
import {
  createDocument,
  deleteDocument,
  getCurrentUser,
  getDocumentById,
  updateDocument,
} from "@/services/appwrite";
import { refreshInteractionMap } from "@/utility/interactionUtils";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";

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
  const dispatch = useDispatch<AppDispatch>();
  const [state, setState] = useState<InteractionResult>({
    isLiked: initial?.isLiked ?? false,
    likeDocId: initial?.likeDocId,
    isBookmarked: initial?.isBookmarked ?? false,
    bookmarkDocId: initial?.bookmarkDocId,
    isFollowing: initial?.isFollowing ?? false,
    followDocId: initial?.followDocId,
  });

  const updateFollowCounts = async (
    currentUserId: string,
    targetUserId: string,
    delta: 1 | -1
  ) => {
    try {
      const [currentUserDoc, targetUserDoc] = await Promise.all([
        getDocumentById(AppwriteConfig.USERS_COLLECTION_ID, currentUserId),
        getDocumentById(AppwriteConfig.USERS_COLLECTION_ID, targetUserId),
      ]);

      const updatedFollowing = Math.max(
        0,
        (currentUserDoc.following_count ?? 0) + delta
      );
      const updatedFollowers = Math.max(
        0,
        (targetUserDoc.followers_count ?? 0) + delta
      );

      await Promise.all([
        updateDocument(AppwriteConfig.USERS_COLLECTION_ID, currentUserId, {
          following_count: updatedFollowing,
        }),
        updateDocument(AppwriteConfig.USERS_COLLECTION_ID, targetUserId, {
          followers_count: updatedFollowers,
        }),
      ]);

      dispatch(
        updateProfileField({ key: "followingCount", value: updatedFollowing })
      );
    } catch (err) {
      console.warn("Failed to update follow counts:", err);
    }
  };

  const toggleInteraction = async (type: InteractionType) => {
    try {
      const currentUser = await getCurrentUser();
      const collection = AppwriteConfig.INTERACTIONS_COLLECTION_ID;

      const interactionMap = {
        like: {
          active: state.isLiked,
          docId: state.likeDocId,
          update: (active: boolean, docId?: string) =>
            setState((prev) => ({
              ...prev,
              isLiked: active,
              likeDocId: docId,
            })),
          toast: { added: "Added to Likes", removed: "Removed from Likes" },
        },
        bookmark: {
          active: state.isBookmarked,
          docId: state.bookmarkDocId,
          update: (active: boolean, docId?: string) =>
            setState((prev) => ({
              ...prev,
              isBookmarked: active,
              bookmarkDocId: docId,
            })),
          toast: {
            added: "Added to Bookmarks",
            removed: "Removed from Bookmarks",
          },
        },
        follow: {
          active: state.isFollowing,
          docId: state.followDocId,
          update: (active: boolean, docId?: string) =>
            setState((prev) => ({
              ...prev,
              isFollowing: active,
              followDocId: docId,
            })),
        },
      };

      const { active, docId, update } = interactionMap[type];

      if (active && docId) {
        await deleteDocument(collection, docId);
        update(false, undefined);

        if (type === "follow") {
          await updateFollowCounts(currentUser.$id, targetId, -1);
        } else if ("toast" in interactionMap[type]) {
          Toast.show({
            type: "success",
            text1: (interactionMap[type] as any).toast.removed,
          });
        }
      } else {
        const newDoc = await createDocument(collection, {
          user_id: currentUser.$id,
          item_id: targetId,
          type,
          created_at: new Date().toISOString(),
        });

        update(true, newDoc.$id);

        if (type === "follow") {
          await updateFollowCounts(currentUser.$id, targetId, 1);
        } else if ("toast" in interactionMap[type]) {
          Toast.show({
            type: "success",
            text1: (interactionMap[type] as any).toast.added,
          });
        }
      }

      refreshInteractionMap(dispatch);
    } catch (err) {
      console.warn(`Failed to toggle ${type}:`, err);
    }
  };

  return {
    isLiked: state.isLiked,
    isBookmarked: state.isBookmarked,
    isFollowing: state.isFollowing,
    toggleLike: () => toggleInteraction("like"),
    toggleBookmark: () => toggleInteraction("bookmark"),
    toggleFollow: () => toggleInteraction("follow"),
  };
}
