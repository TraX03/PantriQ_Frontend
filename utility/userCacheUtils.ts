import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { getDocumentById, listDocuments } from "@/services/appwrite";
import { Query } from "react-native-appwrite";
import { getImageUrl } from "./imageUtils";

type UserInfo = {
  name: string;
  profilePic?: string;
};

const userCache = new Map<string, UserInfo>();

/**
 * Fetches users by IDs with caching to minimize API calls.
 * Returns a map of userId -> UserInfo.
 */
export const fetchUsers = async (
  ids: string[]
): Promise<Map<string, UserInfo>> => {
  const uniqueIds = Array.from(new Set(ids)).filter(Boolean);
  const uncachedIds = uniqueIds.filter((id) => !userCache.has(id));

  if (uncachedIds.length > 0) {
    const users = await listDocuments(AppwriteConfig.USERS_COLLECTION_ID, [
      Query.equal("$id", uncachedIds),
    ]);

    users.forEach((user) => {
      userCache.set(user.$id, {
        name: user.username ?? "Unknown",
        profilePic: user.avatar ? getImageUrl(user.avatar) : undefined,
      });
    });
  }

  const result = new Map<string, UserInfo>();
  uniqueIds.forEach((id) => {
    const user = userCache.get(id);
    if (user) result.set(id, user);
  });

  return result;
};

const setUserCache = (userId: string, userInfo: UserInfo) => {
  userCache.set(userId, userInfo);
};

export const syncUserCache = async (userId: string) => {
  try {
    const updatedUser = await getDocumentById(
      AppwriteConfig.USERS_COLLECTION_ID,
      userId
    );
    setUserCache(userId, {
      name: updatedUser.username ?? "Unknown",
      profilePic: updatedUser.avatar
        ? getImageUrl(updatedUser.avatar)
        : undefined,
    });
  } catch (err) {
    console.warn("Failed to sync user cache:", err);
  }
};
