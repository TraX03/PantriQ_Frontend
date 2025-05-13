import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { databases } from "@/services/appwrite";
import { TheMealDB_Config } from "@/services/MealDbApi";
import { ID } from "react-native-appwrite";

const parseIngredients = (meal: any) => {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() && measure && measure.trim()) {
      ingredients.push({
        name: ingredient,
        quantity: measure,
      });
    }
  }
  return ingredients;
};

const flattenIngredients = (
  ingredients: { name: string; quantity: string }[]
): string[] => {
  return ingredients.map(
    (ingredient) => `${ingredient.name} - ${ingredient.quantity}`
  );
};

const parseInstructions = (instructions: string): string[] => {
  const instructionSteps = instructions
    .split(".")
    .map((step) => step.trim())
    .filter((step) => step.length > 0);

  return instructionSteps;
};

export const fetchAndSaveMeals = async () => {
  const { DATABASE_ID, RECIPES_COLLECTION_ID } = AppwriteConfig;
  const { THEMEALDB_ID, BASE_URL } = TheMealDB_Config;

  try {
    const res = await fetch(`${BASE_URL}/search.php?f=z`);
    const data = await res.json();
    const meals: any[] = data.meals || [];

    for (const meal of meals) {
      try {
        await databases.createDocument(
          DATABASE_ID,
          RECIPES_COLLECTION_ID,
          ID.unique(),
          {
            title: meal.strMeal,
            image: [meal.strMealThumb],
            author_id: THEMEALDB_ID,
            ingredients: flattenIngredients(parseIngredients(meal)),
            instructions: parseInstructions(meal.strInstructions),
            area: meal.strArea,
            category: [meal.strCategory],
            created_at: new Date().toISOString(),
          }
        );

        console.log(`Saved: ${meal.strMeal}`);
      } catch (saveErr) {
        console.warn(`Failed to save ${meal.strMeal}`, saveErr);
      }
    }

    console.log(`Done: Imported ${meals.length} meals.`);
  } catch (err) {
    console.error("Error fetching meals or saving to Appwrite:", err);
  }
};
