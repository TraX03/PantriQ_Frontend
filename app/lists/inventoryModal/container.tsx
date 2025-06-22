import { useFieldState } from "@/hooks/useFieldState";
import { ListItem, ListsState } from "../controller";
import InventoryModalComponent from "./component";
import useInventoryModalController from "./controller";

export type ContainerProps = {
  lists: ReturnType<typeof useFieldState<ListsState>>;
  listData: {
    checkedItems: ListItem[];
    uncheckedItems: ListItem[];
  };
  handleMoveToInventory: () => Promise<void>;
};

export default function InventoryModalContainer({
  lists,
  listData,
  handleMoveToInventory,
}: ContainerProps) {
  const { hasMismatch, modifyDraftFieldAtIndex } =
    useInventoryModalController(lists);

  return (
    <InventoryModalComponent
      lists={lists}
      listData={listData}
      hasMismatch={hasMismatch}
      handleMoveToInventory={handleMoveToInventory}
      modifyDraftFieldAtIndex={modifyDraftFieldAtIndex}
    />
  );
}
