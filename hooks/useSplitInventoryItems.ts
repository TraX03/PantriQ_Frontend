import { ListItem, ListType } from "@/app/lists/controller";

export function useSplitInventoryItems(items: ListItem[], activeTab: ListType) {
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

      if (activeTab !== "shopping" && isExpired) {
        expired.push(qty);
        if (expiry) expiredExp.push(expiry);
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
      quantityDisplay: item.quantityDisplay ?? q.reduce((sum, x) => sum + x, 0),
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

  return {
    checkedItems,
    uncheckedItems,
    expiredItems,
  };
}
