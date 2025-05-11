import { Post } from "@/components/PostCard";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { databases, storage } from "./appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TheMealDB_Config = {
  BASE_URL: "https://www.themealdb.com/api/json/v1/1",
  THEMEALDB_ID: "6820380fced41380df17",
  CACHE_KEY: "cachedMeals",
  CACHE_TIME_KEY: "cachedMealsTimestamp",
  CACHE_DURATION: 1000 * 60 * 60 * 24, // 24 hours
};

export const fetchIngredients = async (): Promise<string[]> => {
  try {
    const response = await fetch(
      `${TheMealDB_Config.BASE_URL}/list.php?i=list`
    );
    const data = await response.json();

    if (!data.meals) return [];

    return data.meals.map((item: any) => item.strIngredient.trim());
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return [];
  }
};

export const fetchSampleMeals = async (): Promise<Post[]> => {
  try {
    const { DATABASE_ID, USERS_COLLECTION_ID, BUCKET_ID } = AppwriteConfig;
    const {
      THEMEALDB_ID,
      BASE_URL,
      CACHE_KEY,
      CACHE_TIME_KEY,
      CACHE_DURATION,
    } = TheMealDB_Config;

    // Get author info from Appwrite
    const mealDBUser = await databases.getDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      THEMEALDB_ID
    );
    const mealDBAuthor = {
      name: mealDBUser.username,
      profilePic: storage.getFileView(BUCKET_ID, mealDBUser.avatar).href,
    };

    // Try to load cached meals
    const now = Date.now();
    const cachedAt = Number(await AsyncStorage.getItem(CACHE_TIME_KEY));
    let cachedMeals: any[] | null = null;

    if (cachedAt && now - cachedAt < CACHE_DURATION) {
      const stored = await AsyncStorage.getItem(CACHE_KEY);
      if (stored) {
        cachedMeals = JSON.parse(stored);
      }
    }

    // Fetch meals if not cached or cache expired
    if (!cachedMeals) {
      const alphabet = Array.from({ length: 26 }, (_, i) =>
        String.fromCharCode(97 + i)
      );

      const fetchPromises = alphabet.map((letter) =>
        fetch(`${BASE_URL}/search.php?f=${letter}`)
          .then((res) => res.json())
          .then((data) => data.meals || [])
          .catch(() => [])
      );

      const results = await Promise.allSettled(fetchPromises);
      cachedMeals = results.flatMap((result) =>
        result.status === "fulfilled" ? result.value : []
      );

      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cachedMeals));
      await AsyncStorage.setItem(CACHE_TIME_KEY, now.toString());
    }

    // Shuffle meals
    const shuffledMeals = [...cachedMeals];
    for (let i = shuffledMeals.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledMeals[i], shuffledMeals[j]] = [
        shuffledMeals[j],
        shuffledMeals[i],
      ];
    }

    // Map meals to Post format
    return shuffledMeals.slice(0, 50).map((meal: any) => ({
      id: meal.idMeal,
      type: "recipe",
      title: meal.strMeal,
      image: meal.strMealThumb,
      author: mealDBAuthor.name,
      profilePic: mealDBAuthor.profilePic,
    }));
  } catch (error) {
    console.error("Error fetching meals from TheMealDB:", error);
    return [];
  }
};
