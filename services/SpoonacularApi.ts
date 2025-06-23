import { RecipePost } from "@/app/content/posts/controller";

const SpoonacularConfig = {
  BASE_URL: "https://api.spoonacular.com/recipes/",
  API_KEY: "563397ab406d4ea1b7ebefe5e892fc1c",
};

export const analyzeRecipe = async (recipe: RecipePost) => {
  const ingredientsList = recipe.ingredients.map(
    (ing) => `${ing.quantity} ${ing.name}`
  );

  const payload = {
    title: recipe.title,
    servings: 1,
    ingredients: ingredientsList,
    instructions: recipe.instructions.map((inst) => inst.text).join(" "),
  };

  try {
    const url = new URL("analyze", SpoonacularConfig.BASE_URL);
    url.searchParams.set("apiKey", SpoonacularConfig.API_KEY);
    url.searchParams.set("includeNutrition", "true");

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.warn(`Spoonacular API error ${res.status}: ${errorText}`);
      return null;
    }

    return void (await res.json());
  } catch (err) {
    console.error("Failed to analyze recipe:", err);
    return null;
  }
};
