import { addDays, format, startOfDay } from "date-fns";
import { useEffect } from "react";
import PlannerComponent from "./component";
import usePlannerController from "./controller";

export default function PlannerContainer() {
  const { date, planner, generateMeals, handleChangeWeek } =
    usePlannerController();
  const { selectedDate, setFieldState } = planner;
  const { weekStart, minDate } = date;

  useEffect(() => {
    const weekDates = Array.from({ length: 7 }).map((_, i) =>
      startOfDay(addDays(weekStart, i))
    );

    const validWeekDates = weekDates.filter((day) => day >= minDate);
    const isSelectedDateValid = validWeekDates.some(
      (d) => format(d, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
    );

    if (!isSelectedDateValid && validWeekDates.length > 0) {
      const validBeforeOrOn = validWeekDates.filter((d) => d <= selectedDate);
      const newSelectedDate =
        validBeforeOrOn.length > 0 ? validBeforeOrOn.at(-1) : validWeekDates[0];
      if (
        newSelectedDate &&
        format(newSelectedDate, "yyyy-MM-dd") !==
          format(selectedDate, "yyyy-MM-dd")
      ) {
        setFieldState("selectedDate", newSelectedDate);
      }
    }
  }, [weekStart, selectedDate, minDate, setFieldState]);

  return (
    <PlannerComponent
      planner={planner}
      generateMeals={generateMeals}
      date={date}
      handleChangeWeek={handleChangeWeek}
    />
  );
}
