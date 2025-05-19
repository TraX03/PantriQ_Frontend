import PlannerComponent from "./component";
import usePlannerController from "./controller";

export default function PlannerContainer() {
  const { planner } = usePlannerController();

  return <PlannerComponent planner={planner} />;
}
