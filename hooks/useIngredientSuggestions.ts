import { fetchIngredients } from "@/services/api";
import { useEffect, useState } from "react";

export const useIngredientSuggestions = () => {
  const [allIngredients, setAllIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadIngredients = async () => {
      setLoading(true);
      const list = await fetchIngredients();
      setAllIngredients(list);
      setLoading(false);
    };

    loadIngredients();
  }, []);

  const getSuggestions = (query: string): string[] => {
    if (!query) return [];
    return allIngredients
      .filter((name) => name.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 5);
  };

  return { getSuggestions, loading };
};
