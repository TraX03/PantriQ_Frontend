import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import SearchComponent from "./component";
import useSearchController from "./controller";

export default function SearchContainer() {
  const { search, handleSearch, handleClear, init } = useSearchController();
  const { isFromMealPlan, mealtime } = useLocalSearchParams();
  const fromMealPlan = isFromMealPlan === "true";

  useEffect(() => {
    init();
  }, []);

  return (
    <SearchComponent
      search={search}
      handleSearch={handleSearch}
      handleClear={handleClear}
      isFromMealPlan={fromMealPlan}
      mealtime={mealtime as string}
    />
  );
}
