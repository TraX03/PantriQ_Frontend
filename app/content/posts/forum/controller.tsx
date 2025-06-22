import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { useFieldState } from "@/hooks/useFieldState";
import {
  createDocument,
  fetchAllDocuments,
  getDocumentById,
  updateDocument,
} from "@/services/Appwrite";
import { getImageUrl } from "@/utility/imageUtils";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { Query } from "react-native-appwrite";

interface Comment {
  id: string;
  content: string;
  timeAgo: string;
  user: {
    username: string;
    avatarUrl: string;
  };
}

export interface ForumState {
  comment: string;
  comments: Comment[];
}

export const useForumController = (postId?: string, currentUserId?: string) => {
  const forum = useFieldState<ForumState>({
    comment: "",
    comments: [],
  });
  const { comment, setFieldState } = forum;

  const getUpdatedText = (createdAt: Date) => {
    const created = new Date(createdAt);
    if (isToday(created)) return "Created today";
    if (isYesterday(created)) return "Created yesterday";

    return `Created on ${format(created, "d MMM yyyy")}`;
  };

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    try {
      await createDocument(AppwriteConfig.COMMENTS_COLLECTION_ID, {
        post_id: postId,
        author_id: currentUserId,
        content: comment.trim(),
        created_at: new Date().toISOString(),
      });

      const postDocument = await getDocumentById(
        AppwriteConfig.POSTS_COLLECTION_ID,
        postId!
      );

      await updateDocument(AppwriteConfig.POSTS_COLLECTION_ID, postId!, {
        comments_count: postDocument.comments_count + 1,
      });

      setFieldState("comment", "");
      getComments();
    } catch (error) {
      console.error("Failed to submit comment", error);
    }
  };

  const getComments = async () => {
    if (!postId) return;

    try {
      const res = await fetchAllDocuments(
        AppwriteConfig.COMMENTS_COLLECTION_ID,
        [Query.equal("post_id", postId), Query.orderDesc("created_at")]
      );

      const userIds = Array.from(new Set(res.map((c) => c.author_id)));

      const userPromises = userIds.map((id) =>
        getDocumentById(AppwriteConfig.USERS_COLLECTION_ID, id)
      );

      const users = await Promise.all(userPromises);

      const userMap = Object.fromEntries(
        users.map((u) => [
          u.$id,
          { username: u.username, avatarUrl: getImageUrl(u.avatar) },
        ])
      );

      const formatted = res.map((c) => ({
        id: c.$id,
        content: c.content,
        timeAgo: formatDistanceToNow(new Date(c.created_at), {
          addSuffix: true,
        }),
        user: userMap[c.author_id],
      }));

      setFieldState("comments", formatted);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  return { forum, getUpdatedText, handleSubmit, getComments };
};

export default useForumController;
