import { fetchIngredients } from "@/services/MealDbApi";
import { useEffect, useState } from "react";

export const useIngredientSuggestions = () => {
  const [allIngredients, setAllIngredients] = useState<string[]>([]);

  useEffect(() => {
    const loadIngredients = async () => {
      const list = await fetchIngredients();
      setAllIngredients(list);
    };

    loadIngredients();
  }, []);

  const getSuggestions = (query: string): string[] => {
    if (!query) return [];
    return allIngredients
      .filter((name) => name.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 5);
  };

  return { getSuggestions };
};
