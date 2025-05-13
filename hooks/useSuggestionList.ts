import { useEffect, useState } from "react";
import {
  fetchIngredients,
  fetchCategory,
  fetchArea,
} from "@/services/MealDbApi";

type SuggestionType = "ingredient" | "category" | "area";

const fetchMap: Record<SuggestionType, () => Promise<string[]>> = {
  ingredient: fetchIngredients,
  category: fetchCategory,
  area: fetchArea,
};

export const useSuggestionList = (type: SuggestionType) => {
  const [allItems, setAllItems] = useState<string[]>([]);

  useEffect(() => {
    const loadItems = async () => {
      const fetchFn = fetchMap[type];
      const list = await fetchFn();
      setAllItems(list);
    };

    loadItems();
  }, [type]);

  const getSuggestions = (query: string): string[] => {
    if (!query) return [];
    return allItems
      .filter((name) => name.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 5);
  };

  return { getSuggestions, allItems };
};
