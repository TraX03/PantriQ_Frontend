import { mockPosts } from "@/data/mockPosts";
import { Post } from "@/components/PostCard";

export default function HomeController(activeSuggestion: string) {
  const typedPosts = mockPosts as Post[];

  return typedPosts.filter((post) => {
    switch (activeSuggestion) {
      case "Recipe":
        return post.type === "recipe";
      case "Tips & Advice":
        return post.type === "tips";
      case "Communities":
        return post.type === "community";
      case "Discussions":
        return post.type === "discussion";
      default:
        return true;
    }
  });
}
