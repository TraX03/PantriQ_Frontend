import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { client, listDocuments } from "@/services/appwrite";
import { Query, RealtimeResponseEvent } from "react-native-appwrite";
import { getImageUrl } from "./imageUtils";

type UserInfo = {
  name: string;
  profilePic?: string;
};

const userCache = new Map<string, UserInfo>();

const setUserCache = (userId: string, info: UserInfo) => {
  userCache.set(userId, info);
};

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
      setUserCache(user.$id, {
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

export const subscribeToUserUpdates = () => {
  const channel = `databases.${AppwriteConfig.DATABASE_ID}.collections.${AppwriteConfig.USERS_COLLECTION_ID}.documents`;

  const unsubscribe = client.subscribe(
    channel,
    (res: RealtimeResponseEvent<any>) => {
      const user = res.payload;
      const userId = user.$id;

      if (userCache.has(userId)) {
        setUserCache(userId, {
          name: user.username ?? "Unknown",
          profilePic: user.avatar ? getImageUrl(user.avatar) : undefined,
        });
      }
    }
  );

  return unsubscribe;
};
