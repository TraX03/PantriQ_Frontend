import HomeController from "./controller";
import HomeComponent from "./component";
import { useFieldState } from "@/hooks/useFieldState";

const suggestions = ["Recipe", "Tips & Advice", "Communities", "Discussions"];

export default function HomeContainer() {
  const home = useFieldState({
    activeTab: "Explore",
    activeSuggestion: "Recipe",
  });

  const filteredPosts = HomeController(home.activeSuggestion);

  return (
    <HomeComponent
      suggestions={suggestions}
      filteredPosts={filteredPosts}
      home={home}
    />
  );
}
