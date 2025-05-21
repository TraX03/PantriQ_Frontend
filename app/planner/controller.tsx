import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { useFieldState } from "@/hooks/useFieldState";
import { listDocuments } from "@/services/appwrite";
import { getImageUrl } from "@/utility/imageUtils";
import { addDays, differenceInCalendarDays, startOfDay } from "date-fns";
import { Query } from "react-native-appwrite";

type Meal = {
  mealtime: string;
  recipe: {
    name: string;
    image: string;
    id: string;
  } | null;
};

export interface PlannerState {
  showDatePicker: boolean;
  selectedDate: Date;
  meals: Meal[];
}

const MEALTIMES = ["Breakfast", "Lunch", "Dinner", "Snacks"];
const today = startOfDay(new Date());
const MIN_DATE = addDays(today, -30);

const clampDate = (date: Date) => (date < MIN_DATE ? MIN_DATE : date);
const getWeekStart = (date: Date) =>
  startOfDay(addDays(date, -((date.getDay() + 6) % 7)));

export const usePlannerController = () => {
  const initialMeals = MEALTIMES.map((mealtime) => ({
    mealtime,
    recipe: null,
  }));

  const planner = useFieldState<PlannerState>({
    showDatePicker: false,
    selectedDate: today,
    meals: initialMeals,
  });

  const { meals, selectedDate, setFieldState } = planner;

  const weekStart = getWeekStart(selectedDate);

  const handleChangeWeek = (direction: "prev" | "next") => {
    const offset = direction === "prev" ? -7 : 7;
    const newWeekStart = addDays(weekStart, offset);
    const dayIndex = differenceInCalendarDays(selectedDate, weekStart);
    const newSelectedDate = clampDate(addDays(newWeekStart, dayIndex));
    setFieldState("selectedDate", newSelectedDate);
  };

  const generateMeals = async () => {
    const updatedMeals = await Promise.all(
      meals.map(async (meal) => {
        try {
          const recipes = await listDocuments(
            AppwriteConfig.RECIPES_COLLECTION_ID,
            [Query.equal("category", meal.mealtime)]
          );

          if (!recipes.length) {
            console.warn(`No recipes found for ${meal.mealtime}`);
            return meal;
          }

          const randomRecipe =
            recipes[Math.floor(Math.random() * recipes.length)];
          return {
            ...meal,
            recipe: {
              name: randomRecipe.title,
              image: getImageUrl(randomRecipe.image[0]),
              id: randomRecipe.$id,
            },
          };
        } catch (error) {
          console.error("Error fetching recipes:", error);
          return meal;
        }
      })
    );
    setFieldState("meals", updatedMeals);
  };

  return {
    date: { minDate: MIN_DATE, weekStart },
    planner,
    generateMeals,
    handleChangeWeek,
  };
};

export default usePlannerController;
