import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { useFieldState } from "@/hooks/useFieldState";
import { createDocument, getCurrentUser } from "@/services/appwrite";

type ListType = "Shopping" | "Inventory";

type ListItem = {
  type: ListType;
  name: string;
  quantity: number;
  checked?: boolean;
};

export interface ListsState {
  activeTab: ListType;
  showAddModal: boolean;
  items: ListItem[];
}

export const useListsController = () => {
  const lists = useFieldState<ListsState>({
    activeTab: "Shopping",
    showAddModal: false,
    items: [],
  });

  const addItemToList = async (name: string, quantity: number = 1) => {
    const newItem: ListItem = {
      type: lists.activeTab,
      name,
      quantity,
      checked: false,
    };

    lists.setFieldState("items", [...lists.items, newItem]);

    try {
      const user = await getCurrentUser();
      await createDocument(AppwriteConfig.LISTS_COLLECTION_ID, {
        ...newItem,
        user_id: user.$id,
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Failed to add item to Appwrite:", err);
    }

    lists.setFieldState("showAddModal", false);
  };

  return { lists, addItemToList };
};

export default useListsController;
