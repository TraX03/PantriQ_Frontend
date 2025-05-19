import { addDays, format, startOfDay } from "date-fns";
import { useEffect } from "react";
import PlannerComponent from "./component";
import usePlannerController from "./controller";

export default function PlannerContainer() {
  const { date, planner, generateMeals, handleChangeWeek } =
    usePlannerController();
  const { selectedDate, setFieldState } = planner;
  const { weekStart, minDate, maxDate } = date;

  useEffect(() => {
    const weekDates = Array.from({ length: 7 }).map((_, i) =>
      startOfDay(addDays(weekStart, i))
    );

    const validWeekDates = weekDates.filter(
      (day) => day >= minDate && day <= maxDate
    );

    const isSelectedInValidWeek = validWeekDates.some(
      (d) => format(d, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
    );

    if (!isSelectedInValidWeek && validWeekDates.length > 0) {
      const validBeforeOrOn = validWeekDates.filter((d) => d <= selectedDate);

      if (validBeforeOrOn.length > 0) {
        setFieldState("selectedDate", validBeforeOrOn.at(-1)!);
      } else {
        setFieldState("selectedDate", validWeekDates[0]);
      }
    }
  }, [weekStart, selectedDate, minDate, maxDate, setFieldState]);

  return (
    <PlannerComponent
      planner={planner}
      generateMeals={generateMeals}
      date={date}
      handleChangeWeek={handleChangeWeek}
    />
  );
}
