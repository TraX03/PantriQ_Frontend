import { useEffect } from "react";
import HomeComponent from "./component";
import { useHomeController } from "./controller";

export default function HomeContainer() {
  const { home, suggestions, filteredPosts, refreshing, onRefresh } =
    useHomeController();

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

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
