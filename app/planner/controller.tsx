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

export const usePlannerController = () => {
  const mealtimes = ["Breakfast", "Lunch", "Dinner", "Snacks"];

  const initialMeals = mealtimes.map((mealtime) => ({
    mealtime,
    recipe: null,
  }));

  const planner = useFieldState<PlannerState>({
    showDatePicker: false,
    selectedDate: new Date(),
    meals: initialMeals,
  });

  const { meals, selectedDate, setFieldState } = planner;

  const today = startOfDay(new Date());
  const minDate = addDays(today, -30);
  const maxDate = addDays(today, 30);
  const weekStart = startOfDay(
    addDays(selectedDate, -((selectedDate.getDay() + 6) % 7))
  );

  const clampDate = (date: Date) =>
    date < minDate ? minDate : date > maxDate ? maxDate : date;

  const handleChangeWeek = (direction: "prev" | "next") => {
    const offset = direction === "prev" ? -7 : 7;
    const newWeekStart = addDays(weekStart, offset);
    const dayIndex = differenceInCalendarDays(selectedDate, weekStart);
    let newSelectedDate = addDays(newWeekStart, dayIndex);
    newSelectedDate = clampDate(newSelectedDate);
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

          if (recipes.length === 0) {
            console.warn("no recipe found");
            return meal;
          }

          const random = recipes[Math.floor(Math.random() * recipes.length)];

          return {
            ...meal,
            recipe: {
              name: random.title,
              image: getImageUrl(random.image[0]),
              id: random.$id,
            },
          };
        } catch (err) {
          console.error("Error fetching recipes:", err);
          return meal;
        }
      })
    );

    setFieldState("meals", updatedMeals);
  };

  return {
    date: {
      minDate,
      maxDate,
      weekStart,
    },
    planner,
    generateMeals,
    handleChangeWeek,
  };
};

export default usePlannerController;
