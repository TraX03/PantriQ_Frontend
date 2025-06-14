import ListsComponent from "./component";
import useListsController from "./controller";

export default function ListsContainer() {
  const { lists, addItemToList } = useListsController();
  return <ListsComponent lists={lists} addItemToList={addItemToList} />;
}
