import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { useFieldState } from "@/hooks/useFieldState";
import {
  createDocument,
  getCurrentUser,
  listDocuments,
  updateDocument,
} from "@/services/appwrite";
import { getImageUrl } from "@/utility/imageUtils";
import {
  addDays,
  differenceInCalendarDays,
  format,
  startOfDay,
} from "date-fns";
import { ID, Permission, Query, Role } from "react-native-appwrite";

export type Meal = {
  mealtime: string;
  recipes: {
    name: string;
    image: string;
    id: string;
  }[];
};

export interface PlannerState {
  showDatePicker: boolean;
  selectedDate: Date;
  mealsByDate: Record<string, Meal[]>;
  showMealtimeModal: boolean;
  mealtimes: string[];
}

export const availableMealtimes = [
  {
    id: "Breakfast",
    label: "Breakfast",
    categories: ["Breakfast"],
  },
  {
    id: "Lunch",
    label: "Lunch",
    categories: ["Chicken", "Beef", "Vegetarian", "Pasta"],
  },
  {
    id: "AfternoonTea",
    label: "Afternoon Tea",
    categories: ["Dessert", "Miscellaneous", "Side"],
  },
  {
    id: "Dinner",
    label: "Dinner",
    categories: ["Beef", "Lamb", "Pork", "Seafood", "Vegetarian"],
  },
  {
    id: "Supper",
    label: "Supper",
    categories: ["Pasta", "Seafood", "Pork", "Lamb"],
  },
  {
    id: "Snacks",
    label: "Snacks",
    categories: ["Side", "Dessert", "Miscellaneous"],
  },
];

const today = startOfDay(new Date());
const minDate = addDays(today, -30);

const clampDate = (date: Date) => (date < minDate ? minDate : date);
const getWeekStart = (date: Date) =>
  startOfDay(addDays(date, -((date.getDay() + 6) % 7)));

export const usePlannerController = () => {
  const planner = useFieldState<PlannerState>({
    showDatePicker: false,
    selectedDate: today,
    mealsByDate: {},
    showMealtimeModal: false,
    mealtimes: [],
  });

  const { selectedDate, mealsByDate, setFieldState } = planner;
  const weekStart = getWeekStart(selectedDate);
  const dateKey = format(selectedDate, "yyyy-MM-dd");

  const handleChangeWeek = (direction: "prev" | "next") => {
    const offset = direction === "prev" ? -7 : 7;
    const newWeekStart = addDays(weekStart, offset);
    const dayOffset = differenceInCalendarDays(selectedDate, weekStart);
    const newSelectedDate = clampDate(addDays(newWeekStart, dayOffset));
    setFieldState("selectedDate", newSelectedDate);
  };

  const getMealsForDate = (date: Date): Meal[] => {
    const key = format(date, "yyyy-MM-dd");
    return mealsByDate[key] ?? [];
  };

  const fetchRandomRecipes = async (mealtime: string) => {
    try {
      const mealtimeConfig = availableMealtimes.find((m) => m.id === mealtime);
      const categories = mealtimeConfig?.categories ?? [];

      let allRecipes: any[] = [];

      for (const category of categories) {
        const recipes = await listDocuments(
          AppwriteConfig.RECIPES_COLLECTION_ID,
          [Query.equal("category", category)]
        );
        allRecipes.push(...recipes);
      }

      if (!allRecipes.length) return [];

      const numberToSelect = mealtime === "Breakfast" ? 1 : 2;

      const selected = allRecipes
        .sort(() => Math.random() - 0.5)
        .slice(0, numberToSelect);

      return selected.map((r) => ({
        name: r.title,
        image: getImageUrl(r.image[0]),
        id: r.$id,
      }));
    } catch (error) {
      console.error(`Error fetching recipes for ${mealtime}:`, error);
      return [];
    }
  };

  const generateMeals = async () => {
    const currentMeals = getMealsForDate(selectedDate);
    const updatedMeals: Meal[] = await Promise.all(
      currentMeals.map(async (meal) => ({
        mealtime: meal.mealtime,
        recipes: await fetchRandomRecipes(meal.mealtime),
      }))
    );

    try {
      const user = await getCurrentUser();
      const isoDate = selectedDate.toISOString();

      const mealsPayload = updatedMeals
        .filter((meal) => meal.recipes.length > 0)
        .map((meal) =>
          JSON.stringify({
            mealtime: meal.mealtime,
            recipes: meal.recipes.map((r) => r.id),
          })
        );

      const [existing] = await listDocuments(
        AppwriteConfig.MEAL_PLAN_COLLECTION_ID,
        [
          Query.equal("user_id", user.$id),
          Query.equal("date", isoDate),
          Query.limit(1),
        ]
      );

      if (existing) {
        await updateDocument(
          AppwriteConfig.MEAL_PLAN_COLLECTION_ID,
          existing.$id,
          { meals: mealsPayload }
        );
      } else {
        await createDocument(
          AppwriteConfig.MEAL_PLAN_COLLECTION_ID,
          {
            user_id: user.$id,
            date: isoDate,
            meals: mealsPayload,
          },
          ID.unique(),
          [
            Permission.read(Role.user(user.$id)),
            Permission.write(Role.user(user.$id)),
          ]
        );
      }

      setFieldState("mealsByDate", {
        ...mealsByDate,
        [dateKey]: updatedMeals,
      });
    } catch (error) {
      console.error("Error saving meal plan:", error);
    }
  };

  const fetchMealsForDate = async (date: Date) => {
    try {
      const user = await getCurrentUser();
      const isoDate = date.toISOString();

      const [document] = await listDocuments(
        AppwriteConfig.MEAL_PLAN_COLLECTION_ID,
        [
          Query.equal("user_id", user.$id),
          Query.equal("date", isoDate),
          Query.limit(1),
        ]
      );

      if (!document) return;

      const meals: Meal[] = await Promise.all(
        document.meals.map(async (mealJson: string) => {
          const parsed = JSON.parse(mealJson);
          const recipes = await Promise.all(
            parsed.recipes.map(async (id: string) => {
              const [recipe] = await listDocuments(
                AppwriteConfig.RECIPES_COLLECTION_ID,
                [Query.equal("$id", id), Query.limit(1)]
              );
              return {
                name: recipe.title,
                image: getImageUrl(recipe.image[0]),
                id: recipe.$id,
              };
            })
          );
          return {
            mealtime: parsed.mealtime,
            recipes,
          };
        })
      );

      setFieldState("mealsByDate", {
        ...mealsByDate,
        [format(date, "yyyy-MM-dd")]: meals,
      });
    } catch (error) {
      console.error("Error fetching meal plan for date:", error);
    }
  };

  const addMealtime = (mealtime: string) => {
    const existingMeals = getMealsForDate(selectedDate);
    const alreadyExists = existingMeals.some(
      (meal) => meal.mealtime === mealtime
    );

    if (alreadyExists) return;

    const newMeals = [...existingMeals, { mealtime, recipes: [] }];

    setFieldState("mealsByDate", {
      ...mealsByDate,
      [dateKey]: newMeals,
    });

    setFieldState("showMealtimeModal", false);
  };

  return {
    date: { minDate: minDate, weekStart },
    planner,
    generateMeals,
    handleChangeWeek,
    getMealsForDate,
    fetchMealsForDate,
    addMealtime,
  };
};

export default usePlannerController;
