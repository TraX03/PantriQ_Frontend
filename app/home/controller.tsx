import { useState } from "react";
import HomeComponent from "./component";
import { mockPosts } from "@/app/data/mockPosts";
import { Post } from "@/components/PostCard";
import Reactotron from "reactotron-react-native";

const suggestions = ["Recipe", "Tips & Advice", "Communities", "Discussions"];

export default function HomeController() {
  const [activeTab, setActiveTab] = useState("Explore");
  const [activeSuggestion, setActiveSuggestion] = useState("Recipe");
  const typedPosts = mockPosts as Post[];
  Reactotron.log("HEHJEEOEKO");
  const filteredPosts = typedPosts.filter((post) => {
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

  return (
    <HomeComponent
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      activeSuggestion={activeSuggestion}
      setActiveSuggestion={setActiveSuggestion}
      suggestions={suggestions}
      filteredPosts={filteredPosts}
    />
  );
}
