import { useKeyboardVisibility } from "@/hooks/useKeyboardVisibility";
import { useReduxSelectors } from "@/hooks/useReduxSelectors";
import { useSplitInventoryItems } from "@/hooks/useSplitInventoryItems";
import { setHasAddedInventory } from "@/redux/slices/mealplanSlice";
import { AppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ListsComponent from "./component";
import useListsController from "./controller";

export default function ListsContainer() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn, hasAddedInventory } = useReduxSelectors();
  const { lists, actions, init } = useListsController();
  const { checkedItems, uncheckedItems, expiredItems } = useSplitInventoryItems(
    lists.items,
    lists.activeTab
  );

  useKeyboardVisibility((visible) =>
    lists.setFieldState("keyboardVisible", visible)
  );

  useEffect(() => {
    if (!isLoggedIn) return;
    const runInit = async () => {
      await init();
      dispatch(setHasAddedInventory(false));
    };
    runInit();
  }, [hasAddedInventory]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const runLoadItems = async () => {
      await actions.loadItems();
    };
    runLoadItems();
  }, [isLoggedIn, lists.showInventoryModal, lists.currentStepIndex]);

  return (
    <ListsComponent
      lists={lists}
      actions={actions}
      listData={{ checkedItems, uncheckedItems, expiredItems }}
    />
  );
}
