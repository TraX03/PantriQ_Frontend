import { useFieldState } from "@/hooks/useFieldState";
import { ListsState } from "../controller";
import AmountModalComponent from "./component";

export type Props = {
  lists: ReturnType<typeof useFieldState<ListsState>>;
  handleInventoryCheck: (itemId: string, usedAmount: number) => Promise<void>;
};

export default function AmountModalContainer({
  lists,
  handleInventoryCheck,
}: Props) {
  return (
    <AmountModalComponent
      lists={lists}
      handleInventoryCheck={handleInventoryCheck}
    />
  );
}
