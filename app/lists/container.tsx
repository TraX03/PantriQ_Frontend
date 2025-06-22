import { useReduxSelectors } from "@/hooks/useReduxSelectors";
import { useEffect } from "react";
import ListsComponent from "./component";
import useListsController from "./controller";

export default function ListsContainer() {
  const { isLoggedIn } = useReduxSelectors();
  const { lists, actions, listData } = useListsController();

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchAndPrepare = async () => {
      await actions.loadItems();
    };

    fetchAndPrepare();
  }, [isLoggedIn, lists.showInventoryModal, lists.currentStepIndex]);

  return <ListsComponent lists={lists} listData={listData} actions={actions} />;
}
