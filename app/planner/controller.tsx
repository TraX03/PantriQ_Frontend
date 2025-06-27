import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { useFieldState } from "@/hooks/useFieldState";
import {
  createDocument,
  getCurrentUser,
  getDocumentById,
  listDocuments,
  updateDocument,
} from "@/services/Appwrite";
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
    id: "breakfast",
    label: "Breakfast",
    categories: ["breakfast"],
  },
  {
    id: "lunch",
    label: "Lunch",
    categories: ["chicken", "beef", "vegetarian", "pasta"],
  },
  {
    id: "afternoonTea",
    label: "Afternoon Tea",
    categories: ["dessert", "miscellaneous", "side"],
  },
  {
    id: "dinner",
    label: "Dinner",
    categories: ["beef", "lamb", "pork", "seafood", "vegetarian"],
  },
  {
    id: "supper",
    label: "Supper",
    categories: ["pasta", "seafood", "pork", "lamb"],
  },
  {
    id: "snacks",
    label: "Snacks",
    categories: ["side", "dessert", "miscellaneous"],
  },
  { id: "all", label: "All", categories: [] },
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

  const fetchRandomRecipes = async (
    mealtime: string,
    regionPrefs: string[]
  ) => {
    try {
      const mealtimeConfig = availableMealtimes.find((m) => m.id === mealtime);
      const categories = mealtimeConfig?.categories ?? [];

      let allRecipes: any[] = [];

      for (const category of categories) {
        const recipes = await listDocuments(
          AppwriteConfig.RECIPES_COLLECTION_ID,
          [Query.equal("category", category)]
        );

        const regionFiltered = regionPrefs.length
          ? recipes.filter((r) =>
              regionPrefs.some(
                (region) => r.area?.toLowerCase() === region.toLowerCase()
              )
            )
          : recipes;

        allRecipes.push(...regionFiltered);
      }

      if (!allRecipes.length) return [];

      const count = mealtime === "Breakfast" ? 1 : 2;

      return allRecipes
        .sort(() => Math.random() - 0.5)
        .slice(0, count)
        .map((r) => ({
          name: r.title,
          image: getImageUrl(r.image[0]),
          id: r.$id,
          area: r.area,
        }));
    } catch (error) {
      console.error(`Error fetching recipes for ${mealtime}:`, error);
      return [];
    }
  };

  const generateMeals = async () => {
    try {
      const user = await getCurrentUser();
      const isoDate = selectedDate.toISOString();

      const userDoc = await getDocumentById(
        AppwriteConfig.USERS_COLLECTION_ID,
        user.$id
      );
      const regionPrefs = (userDoc.region_pref ?? []) as string[];

      const currentMeals = getMealsForDate(selectedDate);

      const updatedMeals: Meal[] = await Promise.all(
        currentMeals.map(async (meal) => ({
          mealtime: meal.mealtime,
          recipes: await fetchRandomRecipes(meal.mealtime, regionPrefs),
        }))
      );

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
          {
            meals: mealsPayload,
          }
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

      setFieldState("mealsByDate", { ...mealsByDate, [dateKey]: updatedMeals });
    } catch (error) {
      console.error("Error saving meal plan:", error);
    }
  };

  const fetchMealsForDate = async (date: Date) => {
    try {
      const user = await getCurrentUser();
      const isoDate = date.toISOString();
      const key = format(date, "yyyy-MM-dd");

      const [doc] = await listDocuments(
        AppwriteConfig.MEAL_PLAN_COLLECTION_ID,
        [
          Query.equal("user_id", user.$id),
          Query.equal("date", isoDate),
          Query.limit(1),
        ]
      );

      if (!doc) return;

      const meals: Meal[] = await Promise.all(
        doc.meals.map(async (mealJson: string) => {
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
          return { mealtime: parsed.mealtime, recipes };
        })
      );

      setFieldState("mealsByDate", { ...mealsByDate, [key]: meals });
    } catch (error) {
      console.error("Error fetching meal plan for date:", error);
    }
  };

  const addMealtime = (mealtime: string) => {
    const existingMeals = getMealsForDate(selectedDate);
    if (existingMeals.some((meal) => meal.mealtime === mealtime)) return;

    setFieldState("mealsByDate", {
      ...mealsByDate,
      [dateKey]: [...existingMeals, { mealtime, recipes: [] }],
    });

    setFieldState("showMealtimeModal", false);
  };

  return {
    date: { minDate, weekStart },
    planner,
    fetchMealsForDate,
    actions: {
      generateMeals,
      handleChangeWeek,
      getMealsForDate,
      addMealtime,
    },
  };
};

export default usePlannerController;
