import HomeComponent from "./component";
import { useHomeController } from "./controller";

export default function HomeContainer() {
  const { home, suggestions, filteredPosts, refreshing, onRefresh } =
    useHomeController();

  return (
    <HomeComponent
      suggestions={suggestions}
      filteredPosts={filteredPosts}
      home={home}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  );
}
