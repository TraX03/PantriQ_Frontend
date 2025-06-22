import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { setInteractionMap } from "@/redux/slices/interactionSlice";
import { AppDispatch } from "@/redux/store";
import { getCurrentUser, listDocuments } from "@/services/Appwrite";
import { Query } from "react-native-appwrite";

export const fetchInteractions = async (): Promise<Map<string, any>> => {
  const user = await getCurrentUser();
  const interactions = await listDocuments(
    AppwriteConfig.INTERACTIONS_COLLECTION_ID,
    [Query.equal("user_id", user.$id)]
  );

  const map = new Map<string, any>();
  interactions.forEach((doc) => {
    const key = `${doc.type}_${doc.item_id}`;
    map.set(key, doc);
  });

  return map;
};

export const getInteractionStatus = (itemId: string, map: Map<string, any>) => {
  const like = map.get(`like_${itemId}`);
  const bookmark = map.get(`bookmark_${itemId}`);
  const follow = map.get(`follow_${itemId}`);

  return {
    isLiked: !!like,
    likeDocId: like?.$id,
    isBookmarked: !!bookmark,
    bookmarkDocId: bookmark?.$id,
    isFollowing: !!follow,
    followDocId: follow?.$id,
  };
};

export const refreshInteractionMap = async (dispatch: AppDispatch) => {
  const updatedMap = await fetchInteractions();
  dispatch(setInteractionMap(updatedMap));
};
