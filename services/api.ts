export const TheMealDB_Config = {
    BASE_URL: "https://www.themealdb.com/api/json/v1/1",
  };

export const fetchIngredients = async (): Promise<string[]> => {
  try {
    const endpoint = "/list.php?i=list";
    const response = await fetch(`${TheMealDB_Config.BASE_URL}${endpoint}`);
    const data = await response.json();

    if (!data.meals) return [];

    return data.meals.map((item: any) => item.strIngredient.trim());
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return [];
  }
};
