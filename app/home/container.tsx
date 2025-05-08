import HomeController from "./controller";
import HomeComponent from "./component";
import { useFieldState } from "@/hooks/useFieldState";
import { mockPosts } from "@/data/mockPosts";
import { useEffect, useState } from "react";
import { Post } from "@/components/PostCard";

const suggestions = ["Recipe", "Tips & Advice", "Communities", "Discussions"];

export default function HomeContainer() {
  const [refreshing, setRefreshing] = useState(false);

  const home = useFieldState({
    activeTab: "Explore",
    activeSuggestion: "Recipe",
    posts: [] as Post[],
  });

  const { posts, activeSuggestion, setFieldState } = home;

  useEffect(() => {
    refreshPosts();
  }, []);

  const refreshPosts = async () => {
    setRefreshing(true);
    const fetchedPosts = await HomeController.fetchPosts();
    setFieldState("posts", fetchedPosts);
    setRefreshing(false);
  };

  // const filteredPosts = HomeController.filterPosts(posts, activeSuggestion);

  const filteredPosts = HomeController.filterPosts(mockPosts, activeSuggestion);

  return (
    <HomeComponent
      suggestions={suggestions}
      filteredPosts={filteredPosts}
      home={home}
      onRefresh={refreshPosts}
      refreshing={refreshing}
    />
  );
}
