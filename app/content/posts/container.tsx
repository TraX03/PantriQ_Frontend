import { PostType } from "@/components/PostCard";
import { useReduxSelectors } from "@/hooks/useReduxSelectors";
import { setLoading } from "@/redux/slices/loadingSlice";
import { AppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import PostComponent from "./component";
import { usePostController } from "./controller";

type Props = {
  postId: string;
  postType: PostType;
};

export default function PostContainer({ postId, postType }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { interactionMap, currentUserId } = useReduxSelectors();
  const { post, actions, handleAuthorPress } = usePostController(
    postType,
    interactionMap,
    currentUserId
  );

  useEffect(() => {
    (async () => {
      try {
        await actions.getPost(postId);
      } catch (error) {
        console.error("Failed to load post:", error);
      } finally {
        dispatch(setLoading(false));
      }
    })();
  }, [postId]);

  return (
    <PostComponent
      post={post}
      deletePost={actions.confirmDeletePost}
      postType={postType}
      handleAuthorPress={handleAuthorPress}
    />
  );
}
