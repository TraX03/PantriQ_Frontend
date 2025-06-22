import { useFieldState } from "@/hooks/useFieldState";
import { ListsState } from "../controller";

type DraftField = "quantityText" | "quantity" | "unit" | "expiries";

export interface SingleUpdate {
  field: DraftField;
  index: number;
  value?: any;
  insertAfter?: boolean;
}

export interface BatchUpdate {
  updates: SingleUpdate[];
}

export const useInventoryModalController = (
  lists: ReturnType<typeof useFieldState<ListsState>>
) => {
  const { setFieldState } = lists;

  const hasExpiryMismatch = (expiries: string[], quantityCount: number) => {
    const filled = expiries.filter(Boolean);
    return (
      filled.length > 1 &&
      (filled.length !== quantityCount || filled.length !== expiries.length)
    );
  };

  const hasQuantityMismatch = (
    quantityText: string[],
    units: string[],
    checkedCount: number
  ) => {
    const cleanedQuantities = quantityText.filter((q) => q.trim() !== "");
    const cleanedUnits = units.filter((u) => u.trim() !== "");

    const allEmpty =
      cleanedQuantities.length === 0 && cleanedUnits.length === 0;
    const allFilled =
      cleanedQuantities.length === checkedCount &&
      cleanedUnits.length === checkedCount &&
      !units.some((u) => !u || u.trim() === "");

    return !(allEmpty || allFilled);
  };

  const modifyDraftFieldAtIndex = (update: SingleUpdate | BatchUpdate) => {
    const draft = lists.formDrafts?.[lists.currentStepIndex] ?? {};
    const result: Partial<typeof draft> = { ...draft };

    const updates = "updates" in update ? update.updates : [update];

    updates.forEach(({ field, index, value, insertAfter }) => {
      const existingArray = Array.isArray(draft[field])
        ? [...(draft[field] as any[])]
        : [];

      if (value === undefined) {
        existingArray.splice(index, 1);
      } else if (insertAfter) {
        existingArray.splice(index + 1, 0, value);
      } else {
        existingArray[index] = value;
      }

      (result as any)[field] = existingArray;
    });

    setFieldState("formDrafts", {
      ...lists.formDrafts,
      [lists.currentStepIndex]: result,
    });
  };

  return {
    hasMismatch: { hasExpiryMismatch, hasQuantityMismatch },
    modifyDraftFieldAtIndex,
  };
};

export default useInventoryModalController;
