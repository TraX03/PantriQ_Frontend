import { useKeyboardVisibility } from "@/hooks/useKeyboardVisibility";
import { useReduxSelectors } from "@/hooks/useReduxSelectors";
import { useSplitInventoryItems } from "@/hooks/useSplitInventoryItems";
import { useEffect } from "react";
import ListsComponent from "./component";
import useListsController from "./controller";

export default function ListsContainer() {
  const { isLoggedIn } = useReduxSelectors();
  const { lists, actions } = useListsController();
  const { checkedItems, uncheckedItems, expiredItems } = useSplitInventoryItems(
    lists.items,
    lists.activeTab
  );

  useKeyboardVisibility((visible) =>
    lists.setFieldState("keyboardVisible", visible)
  );

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchAndPrepare = async () => {
      await actions.loadItems();
    };

    fetchAndPrepare();
  }, [isLoggedIn, lists.showInventoryModal, lists.currentStepIndex]);

  return (
    <ListsComponent
      lists={lists}
      actions={actions}
      listData={{ checkedItems, uncheckedItems, expiredItems }}
    />
  );
}
