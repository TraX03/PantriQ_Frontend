import ErrorScreen from "@/components/ErrorScreen";
import { PostType } from "@/components/PostCard";
import { setLoading } from "@/redux/slices/loadingSlice";
import { AppDispatch } from "@/redux/store";
import { getPostTypeById } from "@/services/appwrite";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CommunityContainer from "./community/container";
import PostContainer from "./posts/container";

export default function PostRouter() {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [postType, setPostType] = useState<PostType | null>(null);

  useEffect(() => {
    if (typeof id !== "string") return;

    const fetchPostType = async () => {
      dispatch(setLoading(true));
      const type = await getPostTypeById(id);
      setPostType(type);
    };

    fetchPostType();
  }, [id, dispatch]);

  if (typeof id !== "string") {
    return <ErrorScreen message="Invalid post ID." />;
  }

  if (!postType) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {["recipe", "tips", "discussion"].includes(postType) ? (
        <PostContainer postId={id} postType={postType} />
      ) : postType === "community" ? (
        <CommunityContainer communityId={id} />
      ) : (
        <ErrorScreen message="Something went wrong while loading the post. Please refresh or try again later." />
      )}
    </>
  );
}
