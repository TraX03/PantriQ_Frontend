import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { Colors } from "@/constants/Colors";
import { useFieldState } from "@/hooks/useFieldState";
import {
  createDocument,
  deleteDocument,
  fetchAllDocuments,
  getCurrentUser,
  updateDocument,
} from "@/services/Appwrite";
import { predictExpiryDateTime } from "@/services/GeminiApi";
import { Alert } from "react-native";
import { Query } from "react-native-appwrite";
import { LIST_TABS } from "./component";

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
  });

  const { setFieldState, formDrafts, activeTab, items, setFields } = lists;
  const filteredItems = items.filter((item) => item.type === activeTab);
  const expiredItems: ListItem[] = [];

  const splitInventoryItems = filteredItems.flatMap((item) => {
    if (!Array.isArray(item.quantity)) return [item];

    const { quantity, expiries = [], checkedCount = 0 } = item;
    const used: number[] = [],
      usedExp: string[] = [];
    const remaining: number[] = [],
      remainingExp: string[] = [];
    const expired: number[] = [],
      expiredExp: string[] = [];

    let toSplit = checkedCount;

    quantity.forEach((qty, i) => {
      const expiry = expiries[i];
      const isExpired = expiry && new Date(expiry) < new Date();

      if (isExpired) {
        expired.push(qty);
        expiredExp.push(expiry);
        return;
      }

      if (toSplit > 0) {
        if (qty > toSplit) {
          used.push(toSplit);
          remaining.push(qty - toSplit);
          if (expiry) {
            usedExp.push(expiry);
            remainingExp.push(expiry);
          }
          toSplit = 0;
        } else {
          used.push(qty);
          if (expiry) usedExp.push(expiry);
          toSplit -= qty;
        }
      } else {
        remaining.push(qty);
        if (expiry) remainingExp.push(expiry);
      }
    });

    const createItem = (
      q: number[],
      e: string[],
      checked: boolean
    ): ListItem => ({
      ...item,
      quantity: q,
      expiries: e,
      quantityDisplay: q.reduce((sum, x) => sum + x, 0),
      checked,
    });

    if (expired.length)
      expiredItems.push(createItem(expired, expiredExp, false));

    return [
      ...(remaining.length ? [createItem(remaining, remainingExp, false)] : []),
      ...(used.length ? [createItem(used, usedExp, true)] : []),
    ];
  });

  const uncheckedItems = splitInventoryItems.filter((i) => !i.checked);
  const checkedItems = splitInventoryItems.filter((i) => i.checked);

  const loadItems = async () => {
    try {
      const user = await getCurrentUser();
      const docs = await fetchAllDocuments(AppwriteConfig.LISTS_COLLECTION_ID, [
        Query.equal("user_id", user.$id),
      ]);

      const items: ListItem[] = docs.map((doc) => {
        const quantity = Array.isArray(doc.quantity)
          ? doc.quantity
          : [doc.quantity ?? 0];

        return {
          id: doc.$id,
          type: doc.type,
          name: doc.name,
          quantity,
          unit: doc.unit || undefined,
          checked: !!doc.checked,
          checkedCount: doc.checkedCount || undefined,
          expiries: doc.expiries || undefined,
          quantityDisplay: quantity.reduce(
            (sum: number, q: number) => sum + q,
            0
          ),
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
                const updatedDisplay = updatedQty.reduce(
                  (sum, q) => sum + q,
                  0
                );

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
      const quantityDisplay = quantity.reduce((sum, q) => sum + q, 0);

      const checkedCount = Math.max(
        0,
        Math.min(quantityDisplay, (item.checkedCount ?? 0) + (checked ? 1 : -1))
      );

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

  const handleInventoryCheck = async (itemId: string, usedAmount: number) => {
    try {
      const item = items.find((i) => i.id === itemId);
      if (!item) return;

      const max = item.quantityDisplay ?? 1;
      const newChecked = (item.checkedCount ?? 0) + usedAmount;

      if (usedAmount === 0 || newChecked < 0 || newChecked > max) {
        alert("Invalid amount. Please enter a valid number.");
        return;
      }

      await updateDocument(AppwriteConfig.LISTS_COLLECTION_ID, itemId, {
        checkedCount: newChecked,
      });

      setFieldState(
        "items",
        items.map((i) =>
          i.id === itemId ? { ...i, checkedCount: newChecked } : i
        )
      );
    } catch (err) {
      console.error("Failed to update checked quantity:", err);
    }
  };

  const handleMoveToInventory = async () => {
    const checkedItems = items.filter(
      (i) => i.type === "shopping" && i.checked
    );
    const inventoryItems = items.filter((i) => i.type === "inventory");

    try {
      const user = await getCurrentUser();
      const updatedItems: ListItem[] = [];

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
        const { converted, baseUnit } = rawQuantities.reduce(
          (acc, qty, idx) => {
            const unit = rawUnits[idx];
            const conv = UNIT_CONVERSIONS[unit];
            acc.converted.push(conv ? qty * conv.factor : qty);
            acc.baseUnit = conv?.to ?? unit;
            return acc;
          },
          { converted: [] as number[], baseUnit: "" }
        );

        const existing = inventoryItems.find(
          (inv) =>
            inv.name.trim().toLowerCase() ===
            shoppingItem.name.trim().toLowerCase()
        );

        if (existing) {
          const newQ = [
            ...(Array.isArray(existing.quantity)
              ? existing.quantity
              : [existing.quantity ?? 0]),
            ...converted,
          ];
          const newE = [...(existing.expiries ?? []), ...finalExpiries];

          await updateDocument(
            AppwriteConfig.LISTS_COLLECTION_ID,
            existing.id!,
            {
              quantity: newQ,
              expiries: newE,
            }
          );

          updatedItems.push({ ...existing, quantity: newQ, expiries: newE });
        } else {
          const created = await createDocument(
            AppwriteConfig.LISTS_COLLECTION_ID,
            {
              user_id: user.$id,
              type: "inventory",
              name: shoppingItem.name,
              quantity: converted,
              unit: baseUnit,
              expiries: finalExpiries,
              checked: false,
              created_at: new Date().toISOString(),
            }
          );

          updatedItems.push({
            id: created.$id,
            type: "inventory",
            name: shoppingItem.name,
            quantity: converted,
            unit: baseUnit,
            expiries: finalExpiries,
            checked: false,
          });
        }

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

      setFields({
        items: [
          ...items.filter((i) => i.type !== "shopping" || !i.checked),
          ...updatedItems,
        ],
        showInventoryModal: false,
        formDrafts: {},
      });
      loadItems();
    } catch (err) {
      console.error("Failed to move checked shopping items to inventory:", err);
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

  return {
    lists,
    actions: {
      addItemToList,
      loadItems,
      handleShoppingCheck,
      handleMoveToInventory,
      handleClearItems,
      handleInventoryCheck,
      getExpiryStatus,
    },
    listData: {
      checkedItems,
      uncheckedItems,
      expiredItems,
    },
  };
};

export default useListsController;
