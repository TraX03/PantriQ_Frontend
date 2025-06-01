import { RootState } from "@/redux/store";
import { useIsFocused } from "@react-navigation/native";
import { addDays, format, startOfDay } from "date-fns";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import PlannerComponent from "./component";
import usePlannerController from "./controller";

export default function PlannerContainer() {
  const isFocused = useIsFocused();
  const isLoggedIn = useSelector((state: RootState) => !!state.auth.user);

  const {
    date: { weekStart, minDate },
    planner: { selectedDate, setFieldState },
    planner,
    generateMeals,
    handleChangeWeek,
    getMealsForDate,
    fetchMealsForDate,
    addMealtime,
  } = usePlannerController();

  useEffect(() => {
    const formatDate = (d: Date) => format(d, "yyyy-MM-dd");
    const weekDates = Array.from({ length: 7 }, (_, i) =>
      startOfDay(addDays(weekStart, i))
    );

    const validDates = weekDates.filter((date) => date >= minDate);
    const isCurrentSelectionValid = validDates.some(
      (date) => formatDate(date) === formatDate(selectedDate)
    );

    if (!isCurrentSelectionValid && validDates.length > 0) {
      const fallbackDate =
        validDates.filter((date) => date <= selectedDate).at(-1) ??
        validDates[0];

      if (formatDate(fallbackDate) !== formatDate(selectedDate)) {
        setFieldState("selectedDate", fallbackDate);
      }
    }
  }, [weekStart, selectedDate, minDate, setFieldState]);

  useEffect(() => {
    if (isFocused && isLoggedIn) {
      fetchMealsForDate(selectedDate);
    }
  }, [isFocused, selectedDate, isLoggedIn]);

  return (
    <PlannerComponent
      planner={planner}
      generateMeals={generateMeals}
      date={{ weekStart, minDate }}
      handleChangeWeek={handleChangeWeek}
      getMealsForDate={getMealsForDate}
      addMealtime={addMealtime}
    />
  );
}
