import { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setLoading } from "@/redux/slices/loadingSlice";
import { getPostTypeById } from "@/utility/getPostTypeByIdUtils";
import ErrorScreen from "@/components/ErrorScreen";
import RecipeContainer from "./recipe/container";

export default function PostRouter() {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [postType, setPostType] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      dispatch(setLoading(true));
      const type = await getPostTypeById(id as string);
      setPostType(type);
    })();
  }, [id, dispatch]);

  if (postType === "recipe") {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <RecipeContainer recipeId={id as string} />
      </>
    );
  }

  if (
    postType === "community" ||
    postType === "tips" ||
    postType === "discussion"
  ) {
    // TODO: Implement rendering for these post types if needed
    return null;
  }

  return (
    <ErrorScreen message="Something went wrong while loading the post. Please refresh or try again later." />
  );
}
