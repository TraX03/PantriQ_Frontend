import { useFieldState } from "@/hooks/useFieldState";

export interface PlannerState {
  showDatePicker: boolean;
  selectedDate: Date;
}

export const usePlannerController = () => {
  const planner = useFieldState<PlannerState>({
    showDatePicker: false,
    selectedDate: new Date(),
  });

  return {
    planner,
  };
};

export default usePlannerController;
