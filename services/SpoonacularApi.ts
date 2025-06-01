import { Recipe } from "@/app/posts/recipe/controller";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { getDocumentById, updateDocument } from "./appwrite";

const spoonacularFields = [
  "vegetarian",
  "vegan",
  "glutenFree",
  "dairyFree",
  "veryHealthy",
  "cheap",
  "veryPopular",
  "sustainable",
  "lowFodmap",
];

const SpoonacularConfig = {
  BASE_URL: "https://api.spoonacular.com/recipes/",
  API_KEY: "563397ab406d4ea1b7ebefe5e892fc1c",
  TAG_SET: new Set(Object.values(spoonacularFields)),
};

export const analyzeRecipe = async (recipe: Recipe) => {
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

    const data = await res.json();
    void updateRecipeTags(recipe.id, data);
    return data;
  } catch (err) {
    console.error("Failed to analyze recipe:", err);
    return null;
  }
};

const updateRecipeTags = async (recipeId: string, spoonacularData: any) => {
  try {
    const recipe = await getDocumentById(
      AppwriteConfig.RECIPES_COLLECTION_ID,
      recipeId
    );

    const existingTags: string[] = recipe.tags ?? [];

    if (existingTags.some((tag) => SpoonacularConfig.TAG_SET.has(tag))) {
      console.log("Spoonacular tags already present. Skipping update.");
      return recipe;
    }

    const newTags = spoonacularFields.filter((field) => spoonacularData[field]);
    if (newTags.length === 0) {
      console.log("No new Spoonacular tags to add.");
      return recipe;
    }

    const updatedTags = [...new Set([...existingTags, ...newTags])];

    const updatedRecipe = await updateDocument(
      AppwriteConfig.RECIPES_COLLECTION_ID,
      recipeId,
      { tags: updatedTags }
    );

    console.log("Recipe tags updated:", updatedTags);
    return updatedRecipe;
  } catch (err) {
    console.error("Failed to update tags:", err);
    return null;
  }
};
