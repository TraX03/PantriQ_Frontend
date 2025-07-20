import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { Colors } from "@/constants/Colors";
import { useFieldState } from "@/hooks/useFieldState";
import {
  createDocument,
  deleteDocument,
  fetchAllDocuments,
  getCurrentUser,
  getDocumentById,
  updateDocument,
} from "@/services/Appwrite";
import {
  finalizeShoppingList,
  predictExpiryDateTime,
} from "@/services/GeminiApi";
import { Alert } from "react-native";
import { Query } from "react-native-appwrite";
import { LIST_TABS } from "./component";
import { NewItemDraft } from "./inventoryModal/controller";

export const UNIT_CONVERSIONS: Record<string, { to: string; factor: number }> =
  {
    kg: { to: "g", factor: 1000 },
    g: { to: "g", factor: 1 },
    mg: { to: "g", factor: 0.001 },
    oz: { to: "g", factor: 28.3495 },
    lb: { to: "g", factor: 453.592 },
    l: { to: "ml", factor: 1000 },
    ml: { to: "ml", factor: 1 },
    cup: { to: "ml", factor: 240 },
    tbsp: { to: "ml", factor: 15 },
    tsp: { to: "ml", factor: 5 },
    "fl oz": { to: "ml", factor: 29.5735 },
  };

export type ListType = (typeof LIST_TABS)[number];

type MinimalDraft = Partial<{
  quantity: number[];
  quantityText: string[];
  unit: string[];
  expiries: string[];
}>;

export type ListItem = {
  id?: string;
  type: ListType;
  name: string;
  quantity: number[];
  unit?: string;
  checked?: boolean;
  expiries?: string[];
  checkedCount?: number;
  quantityDisplay?: number;
  expiredQuantity?: number;
  expiredUnit?: string;
};

export interface ListsState {
  activeTab: ListType;
  showAddModal: boolean;
  items: ListItem[];
  showInventoryModal: boolean;
  currentStepIndex: number;
  datePickerIndex: number;
  formDrafts: Record<number, MinimalDraft>;
  showDatePicker: boolean;
  modalItem: ListItem | null;
  amount: number;
  amountText?: string;
  showAmountModal: boolean;
  keyboardVisible: boolean;
  isEditing: boolean;
  showLoading: boolean;
  showSyncLoading: boolean;
}

export const useListsController = () => {
  const lists = useFieldState<ListsState>({
    activeTab: "shopping",
    showAddModal: false,
    items: [],
    showInventoryModal: false,
    currentStepIndex: 0,
    datePickerIndex: 0,
    formDrafts: {},
    showDatePicker: false,
    modalItem: null,
    amount: 0,
    showAmountModal: false,
    keyboardVisible: false,
    isEditing: false,
    showLoading: false,
    showSyncLoading: false,
  });

  const { setFieldState, activeTab, items, setFields } = lists;

  const init = async () => {
    try {
      const user = await getCurrentUser();
      const userDoc = await getDocumentById(
        AppwriteConfig.USERS_COLLECTION_ID,
        user.$id
      );
      const inventoryRecipes: string[] = userDoc.inventory_recipes ?? [];

      if (inventoryRecipes.length > 0) {
        Alert.alert(
          "Sync Shopping List",
          `You've added ${inventoryRecipes.length} meal${
            inventoryRecipes.length > 1 ? "s" : ""
          } to your lists. Would you like to sync your shopping list now?`,
          [
            { text: "Not now", style: "cancel" },
            {
              text: "Sync",
              onPress: () => {
                syncInventoryRecipesToShoppingList(inventoryRecipes);
              },
            },
          ]
        );
      }
    } catch (err) {
      console.error("Failed to run init check:", err);
    }
  };

  const loadItems = async () => {
    try {
      const user = await getCurrentUser();
      const docs = await fetchAllDocuments(AppwriteConfig.LISTS_COLLECTION_ID, [
        Query.equal("user_id", user.$id),
      ]);

      const now = new Date();

      const items: ListItem[] = docs.map((doc) => {
        const quantity = Array.isArray(doc.quantity)
          ? doc.quantity
          : [doc.quantity ?? 0];
        const expiries = doc.expiries ?? [];
        const checkedCount = doc.checkedCount || 0;
        const originalUnit = doc.unit ?? "";

        const validQuantities: number[] = [];
        const expiredQuantities: number[] = [];

        quantity.forEach((q: number, i: number) => {
          const expiry = expiries[i];
          (expiry && new Date(expiry) < now
            ? expiredQuantities
            : validQuantities
          ).push(q);
        });

        const totalValidQty = validQuantities.reduce((sum, q) => sum + q, 0);
        const totalExpiredQty = expiredQuantities.reduce(
          (sum, q) => sum + q,
          0
        );
        const displayQty = Math.max(0, totalValidQty - checkedCount);

        let display = displayQty;
        let expired = totalExpiredQty;
        let unit = originalUnit;

        if (doc.type === "inventory" && UNIT_CONVERSIONS[unit]) {
          const { to, factor } = UNIT_CONVERSIONS[unit];
          display *= factor;
          expired *= factor;
          unit = to;

          const reverse = Object.entries(UNIT_CONVERSIONS).find(
            ([fromUnit, config]) => config.to === unit && config.factor > 1
          );

          if (reverse) {
            const [fromUnit, { factor: reverseFactor }] = reverse;
            const reversedDisplay = display / reverseFactor;
            const reversedExpired = expired / reverseFactor;

            if (reversedDisplay >= 1) {
              display = parseFloat(reversedDisplay.toFixed(2));
              expired = parseFloat(reversedExpired.toFixed(2));
              unit = fromUnit;
            }
          }
        }

        return {
          id: doc.$id,
          type: doc.type,
          name: doc.name,
          quantity,
          unit,
          checked: !!doc.checked,
          checkedCount,
          expiries,
          quantityDisplay: display,
          expiredQuantity: expired,
        };
      });

      setFieldState("items", items);
    } catch (err) {
      console.error("Failed to load items from Appwrite:", err);
    }
  };

  const addItemToList = async (
    name: string,
    quantity: number[] = [1],
    unit?: string,
    quantityDisplay: number = 1
  ) => {
    if (activeTab !== "shopping") return;

    const trimmedName = name.trim();
    const normalizedName = trimmedName.toLowerCase();
    const closeModal = () => setFieldState("showAddModal", false);

    const existingItem = items.find(
      (item) =>
        item.type === "shopping" &&
        item.name.trim().toLowerCase() === normalizedName
    );

    if (existingItem) {
      Alert.alert(
        "Duplicate Item",
        `"${existingItem.name}" is already on the list. Add one more?`,
        [
          { text: "No", style: "cancel", onPress: closeModal },
          {
            text: "Yes",
            onPress: async () => {
              try {
                const prevQty = Array.isArray(existingItem.quantity)
                  ? existingItem.quantity
                  : [existingItem.quantity ?? 0];
                const updatedQty = [...prevQty, 1];

                const updatedDisplay =
                  updatedQty.reduce((sum, q) => sum + q, 0) -
                  (existingItem.checkedCount ?? 0);

                await updateDocument(
                  AppwriteConfig.LISTS_COLLECTION_ID,
                  existingItem.id!,
                  {
                    quantity: updatedQty,
                  }
                );

                setFieldState(
                  "items",
                  items.map((item) =>
                    item.id === existingItem.id
                      ? {
                          ...item,
                          quantity: updatedQty,
                          quantityDisplay: updatedDisplay,
                        }
                      : item
                  )
                );
              } catch (err) {
                console.error("Failed to update quantity:", err);
              } finally {
                closeModal();
              }
            },
          },
        ]
      );
      return;
    }

    try {
      const user = await getCurrentUser();
      const created = await createDocument(AppwriteConfig.LISTS_COLLECTION_ID, {
        type: "shopping",
        name: trimmedName,
        quantity,
        unit: unit?.trim() || undefined,
        checked: false,
        user_id: user.$id,
        created_at: new Date().toISOString(),
      });

      setFieldState("items", [
        ...items,
        {
          id: created.$id,
          type: "shopping",
          name: trimmedName,
          quantity,
          unit: unit?.trim() || undefined,
          checked: false,
          quantityDisplay,
        },
      ]);
    } catch (err) {
      console.error("Failed to add shopping item:", err);
    }

    closeModal();
  };

  const handleShoppingCheck = async (itemId: string, checked: boolean) => {
    try {
      const item = items.find((i) => i.id === itemId);
      if (!item) return;

      const quantity = Array.isArray(item.quantity)
        ? item.quantity
        : [item.quantity ?? 0];

      const totalQuantity = quantity.reduce((sum, q) => sum + q, 0);

      const checkedCount = Math.max(
        0,
        Math.min(totalQuantity, (item.checkedCount ?? 0) + (checked ? 1 : -1))
      );

      const quantityDisplay = totalQuantity - checkedCount;

      await updateDocument(AppwriteConfig.LISTS_COLLECTION_ID, itemId, {
        checked,
        checkedCount,
      });

      setFieldState(
        "items",
        items.map((i) =>
          i.id === itemId ? { ...i, checked, checkedCount, quantityDisplay } : i
        )
      );
    } catch (err) {
      console.error("Failed to toggle checked state:", err);
    }
  };

  const handleInventoryCheck = async (
    itemId: string,
    amount: number,
    isRevert?: boolean
  ) => {
    try {
      const item = items.find((i) => i.id === itemId);
      if (!item) return;

      const quantityDisplay = item.quantityDisplay ?? 0;
      const currentChecked = item.checkedCount ?? 0;

      let newChecked = currentChecked;
      let newDisplay = quantityDisplay;

      if (isRevert) {
        newChecked = Math.max(0, currentChecked - amount);
        newDisplay = quantityDisplay + amount;
      } else {
        if (amount > quantityDisplay) {
          alert("Not enough quantity left to use.");
          return;
        }
        newChecked = currentChecked + amount;
        newDisplay = Math.max(0, quantityDisplay - amount);
      }

      await updateDocument(AppwriteConfig.LISTS_COLLECTION_ID, itemId, {
        checkedCount: newChecked,
      });

      setFieldState(
        "items",
        items.map((i) =>
          i.id === itemId
            ? {
                ...i,
                checkedCount: newChecked,
                quantityDisplay: newDisplay,
              }
            : i
        )
      );
    } catch (err) {
      console.error("Failed to update checked quantity:", err);
    }
  };

  const handleMoveToInventory = async (newItemDraft?: NewItemDraft) => {
    setFieldState("showLoading", true);
    const items = lists.items;
    const formDrafts = lists.formDrafts;
    const inventoryItems = items.filter((i) => i.type === "inventory");

    try {
      const updatedItems: ListItem[] = [];

      if (newItemDraft) {
        const rawQuantities =
          newItemDraft.quantity?.length > 0
            ? newItemDraft.quantity
            : [Math.max(1, parseInt(newItemDraft.itemCount ?? "1", 10) || 1)];

        const rawUnits =
          newItemDraft.unit?.length > 0
            ? newItemDraft.unit
            : Array(rawQuantities.length).fill("");

        const { converted, baseUnit } = convertQuantities(
          rawQuantities,
          rawUnits
        );

        let finalExpiries = newItemDraft.expiries?.filter(Boolean) ?? [];
        if (finalExpiries.length === 0 || finalExpiries.every((e) => !e)) {
          const predicted = await predictExpiryDateTime(newItemDraft.itemName);
          finalExpiries = Array(converted.length).fill(predicted);
        }

        const item = await updateInventoryCollection(
          newItemDraft.itemName,
          converted,
          baseUnit,
          finalExpiries,
          inventoryItems
        );

        updatedItems.push(item);
      } else {
        const checkedItems = items.filter(
          (i) => i.type === "shopping" && i.checked
        );

        for (let i = 0; i < checkedItems.length; i++) {
          const shoppingItem = checkedItems[i];
          const draft = formDrafts?.[i] ?? {};

          const originalQuantities = Array.isArray(shoppingItem.quantity)
            ? shoppingItem.quantity
            : [shoppingItem.quantity ?? 1];
          const originalExpiries = shoppingItem.expiries ?? [];

          const toMove = Math.min(
            shoppingItem.checkedCount ?? 0,
            originalQuantities.reduce((sum, q) => sum + q, 0)
          );

          const movedQ: number[] = [],
            movedE: string[] = [];
          const remainingQ: number[] = [],
            remainingE: string[] = [];
          let remaining = toMove;

          originalQuantities.forEach((qty, idx) => {
            const exp = originalExpiries[idx] ?? "";
            if (remaining <= 0) {
              remainingQ.push(qty);
              remainingE.push(exp);
            } else if (qty > remaining) {
              movedQ.push(remaining);
              remainingQ.push(qty - remaining);
              movedE.push(exp);
              remainingE.push(exp);
              remaining = 0;
            } else {
              movedQ.push(qty);
              movedE.push(exp);
              remaining -= qty;
            }
          });

          let finalExpiries = draft.expiries?.filter(Boolean) ?? [];
          if (finalExpiries.length === 0 || finalExpiries.every((e) => !e)) {
            const predicted = await predictExpiryDateTime(shoppingItem.name);
            finalExpiries = Array(movedQ.length).fill(predicted);
          }

          const rawQuantities = draft.quantity ?? movedQ;
          const rawUnits =
            draft.unit ??
            Array(rawQuantities.length).fill(shoppingItem.unit ?? "");
          const { converted, baseUnit } = convertQuantities(
            rawQuantities,
            rawUnits
          );

          const item = await updateInventoryCollection(
            shoppingItem.name,
            converted,
            baseUnit,
            finalExpiries,
            inventoryItems
          );
          updatedItems.push(item);

          if (remainingQ.length > 0) {
            await updateDocument(
              AppwriteConfig.LISTS_COLLECTION_ID,
              shoppingItem.id!,
              {
                quantity: remainingQ,
                expiries: remainingE,
                checked: false,
                checkedCount: 0,
              }
            );
          } else {
            await deleteDocument(
              AppwriteConfig.LISTS_COLLECTION_ID,
              shoppingItem.id!
            );
          }
        }
      }

      setFields({
        items: [
          ...items.filter((i) => i.type !== "shopping" || !i.checked),
          ...updatedItems,
        ],
        showInventoryModal: false,
        showLoading: false,
        formDrafts: {},
      });

      loadItems();
    } catch (err) {
      console.error("Failed to move items to inventory:", err);
    }
  };

  const convertQuantities = (quantities: number[], units: string[]) => {
    return quantities.reduce(
      (acc, qty, idx) => {
        const unit = units[idx];
        const conv = UNIT_CONVERSIONS[unit];
        acc.converted.push(conv ? qty * conv.factor : qty);
        acc.baseUnit = conv?.to ?? unit;
        return acc;
      },
      { converted: [] as number[], baseUnit: "" }
    );
  };

  const updateInventoryCollection = async (
    name: string,
    quantity: number[],
    unit: string,
    expiries: string[],
    inventoryItems: ListItem[]
  ): Promise<ListItem> => {
    const nameLower = name.trim().toLowerCase();

    const existing = inventoryItems.find(
      (inv) => inv.name.trim().toLowerCase() === nameLower
    );

    if (existing) {
      const newQ = [
        ...(Array.isArray(existing.quantity)
          ? existing.quantity
          : [existing.quantity ?? 0]),
        ...quantity,
      ];
      const newE = [...(existing.expiries ?? []), ...expiries];

      await updateDocument(AppwriteConfig.LISTS_COLLECTION_ID, existing.id!, {
        quantity: newQ,
        expiries: newE,
        name: nameLower,
      });

      return {
        ...existing,
        quantity: newQ,
        expiries: newE,
        type: "inventory",
      };
    } else {
      const user = await getCurrentUser();
      const created = await createDocument(AppwriteConfig.LISTS_COLLECTION_ID, {
        user_id: user.$id,
        type: "inventory",
        name: nameLower,
        quantity,
        unit,
        expiries,
        checked: false,
        created_at: new Date().toISOString(),
      });

      return {
        id: created.$id,
        type: "inventory",
        name,
        quantity,
        unit,
        expiries,
        checked: false,
      };
    }
  };

  const handleClearItems = async (
    itemsToClear: ListItem[],
    removeIfExpired: boolean
  ) => {
    for (const item of itemsToClear) {
      const sourceItem = items.find((i) => i.id === item.id);
      if (!sourceItem || !Array.isArray(sourceItem.quantity)) continue;

      const { newQuantities, newExpiries } = getUpdatedQuantitiesAfterRemoval(
        sourceItem,
        item.quantity,
        removeIfExpired
      );

      const hasRemaining = newQuantities.reduce((sum, q) => sum + q, 0) > 0;

      if (hasRemaining) {
        await updateDocument(
          AppwriteConfig.LISTS_COLLECTION_ID,
          sourceItem.id!,
          {
            quantity: newQuantities,
            expiries: newExpiries,
            checked: false,
            checkedCount: 0,
          }
        );
      } else {
        await deleteDocument(
          AppwriteConfig.LISTS_COLLECTION_ID,
          sourceItem.id!
        );
      }
    }

    loadItems();
  };

  const getUpdatedQuantitiesAfterRemoval = (
    sourceItem: ListItem,
    quantitiesToRemove: number[],
    removeIfExpired: boolean
  ): { newQuantities: number[]; newExpiries: string[] } => {
    let toRemove = quantitiesToRemove.reduce((sum, q) => sum + q, 0);
    const newQuantities: number[] = [];
    const newExpiries: string[] = [];

    sourceItem.quantity.forEach((qty, i) => {
      const expiry = sourceItem.expiries?.[i];
      const isExpired = removeIfExpired && expiry && isExpiredDate(expiry);

      if (isExpired) return;

      if (!removeIfExpired && toRemove > 0) {
        if (qty > toRemove) {
          newQuantities.push(qty - toRemove);
          if (expiry) newExpiries.push(expiry);
          toRemove = 0;
        } else {
          toRemove -= qty;
        }
      } else {
        newQuantities.push(qty);
        if (expiry) newExpiries.push(expiry);
      }
    });

    return { newQuantities, newExpiries };
  };

  const isExpiredDate = (dateStr: string): boolean =>
    new Date(dateStr).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

  const getExpiryStatus = (expiries?: string[]) => {
    if (!expiries?.length) return null;

    const now = new Date();
    const soonest = new Date([...expiries].sort()[0]);

    if (soonest <= now) {
      return { label: "Expired", color: Colors.feedback.unknown };
    }

    let diff = soonest.getTime() - now.getTime();
    const msInHour = 1000 * 60 * 60;
    const msInDay = msInHour * 24;
    const msInMonth = msInDay * 30.44;
    const msInYear = msInDay * 365.25;

    const years = Math.floor(diff / msInYear);
    diff %= msInYear;
    const months = Math.floor(diff / msInMonth);
    diff %= msInMonth;
    const days = Math.floor(diff / msInDay);
    diff %= msInDay;
    const hours = Math.floor(diff / msInHour);

    const parts: string[] = [];
    if (years) parts.push(`${years} year${years > 1 ? "s" : ""}`);
    if (months && parts.length < 2)
      parts.push(`${months} month${months > 1 ? "s" : ""}`);
    if (days && parts.length < 2)
      parts.push(`${days} day${days > 1 ? "s" : ""}`);
    if (hours && parts.length < 2)
      parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
    if (!parts.length) parts.push("Less than 1 hour");

    const color =
      years || months
        ? Colors.feedback.success
        : days > 3
        ? Colors.feedback.success
        : days > 0
        ? Colors.feedback.notice
        : Colors.feedback.error;

    return { label: parts.join(" "), color };
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        const current = item.quantityDisplay ?? 1;
        const newQty = Math.max(1, current + delta);
        return {
          ...item,
          quantityDisplay: newQty,
        };
      }
      return item;
    });

    setFieldState("items", updatedItems);
  };

  const saveQuantityChange = async (item: ListItem) => {
    const currentSum = item.quantity?.reduce((sum, x) => sum + x, 0) ?? 1;
    const quantityDisplay = item.quantityDisplay ?? currentSum;

    if (quantityDisplay !== currentSum) {
      const updatedQty = [quantityDisplay];

      try {
        await updateDocument(AppwriteConfig.LISTS_COLLECTION_ID, item.id!, {
          quantity: updatedQty,
        });
      } catch (err) {
        console.warn("Failed to update quantity", err);
      }
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    const updatedItems = items.filter((item) => item.id !== itemId);

    setFieldState("items", [...updatedItems]);

    try {
      await deleteDocument(AppwriteConfig.LISTS_COLLECTION_ID, itemId);
    } catch (error) {
      console.warn("Failed to delete item:", error);
    }
  };

  const syncInventoryRecipesToShoppingList = async (
    inventoryRecipes: string[]
  ) => {
    try {
      const user = await getCurrentUser();
      setFieldState("showSyncLoading", true);
      const allIngredients: {
        name: string;
        quantity: string;
      }[] = [];

      for (const recipeId of inventoryRecipes) {
        const recipeDoc = await getDocumentById(
          AppwriteConfig.RECIPES_COLLECTION_ID,
          recipeId
        );

        const ingredientsRaw: string[] = recipeDoc.ingredients ?? [];

        const parsed = ingredientsRaw
          .map((i) => {
            try {
              const ing = JSON.parse(i);
              return {
                name: ing.name?.toLowerCase()?.split(" or ")[0]?.trim() ?? "",
                quantity: ing.quantity?.trim() ?? "",
              };
            } catch (err) {
              console.warn("⚠️ Failed to parse ingredient:", i);
              return null;
            }
          })
          .filter(Boolean) as { name: string; quantity: string }[];

        allIngredients.push(...parsed);
      }

      const inventoryResponse = await fetchAllDocuments(
        AppwriteConfig.LISTS_COLLECTION_ID,
        [Query.equal("user_id", user.$id), Query.equal("type", "inventory")]
      );

      const userInventory: {
        name: string;
        quantity?: number[];
      }[] = inventoryResponse.map((doc) => ({
        name: doc.name?.toLowerCase()?.trim() ?? "",
        quantity: doc.quantity ?? [],
      }));

      const shoppingListResponse = await fetchAllDocuments(
        AppwriteConfig.LISTS_COLLECTION_ID,
        [Query.equal("user_id", user.$id), Query.equal("type", "shopping")]
      );

      const userShoppingList: {
        name: string;
        quantity?: number[];
      }[] = shoppingListResponse.map((doc) => ({
        name: doc.name?.toLowerCase()?.trim() ?? "",
        quantity: doc.quantity ?? [],
      }));

      const finalShoppingItems = await finalizeShoppingList(
        allIngredients,
        userInventory,
        userShoppingList
      );

      for (const item of finalShoppingItems) {
        await createDocument(AppwriteConfig.LISTS_COLLECTION_ID, {
          user_id: user.$id,
          type: "shopping",
          name: item.name,
          created_at: new Date().toISOString(),
          quantity: [item.quantity],
        });
      }

      await updateDocument(AppwriteConfig.USERS_COLLECTION_ID, user.$id, {
        inventory_recipes: [],
      });

      loadItems();
    } catch (err) {
      console.error("❌ Failed to sync recipes to shopping list:", err);
    } finally {
      setFieldState("showSyncLoading", false);
    }
  };

  return {
    init,
    lists,
    actions: {
      addItemToList,
      loadItems,
      handleShoppingCheck,
      handleMoveToInventory,
      handleClearItems,
      handleInventoryCheck,
      getExpiryStatus,
      handleQuantityChange,
      saveQuantityChange,
      handleRemoveItem,
    },
    getUpdatedQuantitiesAfterRemoval,
  };
};

export default useListsController;
