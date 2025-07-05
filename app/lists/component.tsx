import BottomSheetModal from "@/components/BottomSheetModal";
import SearchWithSuggestion from "@/components/SearchWithSuggestions";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useFieldState } from "@/hooks/useFieldState";
import { capitalize } from "@/utility/capitalize";
import { styles as homeStyles } from "@/utility/home/styles";
import { styles } from "@/utility/lists/styles";
import { styles as onboardingStyles } from "@/utility/onboarding/styles";
import { styles as plannerStyles } from "@/utility/planner/styles";
import React from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import AmountModalContainer from "./amountModal/container";
import { ListItem, ListsState } from "./controller";
import InventoryModalContainer from "./inventoryModal/container";

type Props = {
  lists: ReturnType<typeof useFieldState<ListsState>>;
  listData: {
    checkedItems: ListItem[];
    uncheckedItems: ListItem[];
    expiredItems: ListItem[];
  };
  actions: {
    addItemToList: (name: string, quantity?: number[]) => Promise<void>;
    handleShoppingCheck: (itemId: string, checked: boolean) => Promise<void>;
    handleMoveToInventory: () => Promise<void>;
    handleClearItems: (
      itemsToClear: ListItem[],
      removeIfExpired: boolean
    ) => Promise<void>;
    handleInventoryCheck: (itemId: string, usedAmount: number) => Promise<void>;
    getExpiryStatus: (expiries?: string[]) => {
      label: string;
      color: string;
    } | null;
  };
};

export const LIST_TABS = ["shopping", "inventory"] as const;

export default function ListsComponent({ lists, listData, actions }: Props) {
  const {
    activeTab,
    showAddModal,
    showInventoryModal,
    setFieldState,
    setFields,
    showAmountModal,
    keyboardVisible,
  } = lists;

  const {
    addItemToList,
    handleShoppingCheck,
    handleMoveToInventory,
    handleClearItems,
    handleInventoryCheck,
    getExpiryStatus,
  } = actions;

  const { uncheckedItems, checkedItems, expiredItems } = listData;

  const renderListItem = (
    item: ListItem,
    disabled: boolean,
    useContainer: boolean = true,
    showCheckbox: boolean = true
  ) => {
    const expiryInfo = getExpiryStatus(item.expiries);
    const color = disabled ? Colors.brand.primaryLight : Colors.brand.primary;

    const content = (
      <>
        {showCheckbox && (
          <Pressable
            onPress={() => {
              if (item.type === "inventory") {
                setFields({ modalItem: item, showAmountModal: true });
              } else {
                handleShoppingCheck(item.id!, !item.checked);
              }
            }}
          >
            <IconSymbol
              name={item.checked ? "checkmark.square.fill" : "checkmark.square"}
              color={color}
            />
          </Pressable>
        )}

        <View className="flex-row items-center justify-between flex-1">
          <View>
            <Text style={disabled ? styles.disabledItem : { fontSize: 16 }}>
              {item.name}
            </Text>
            {expiryInfo && (
              <View className="flex-row items-center mt-1 gap-1.5">
                <View
                  style={[
                    styles.expiryIndicator,
                    { backgroundColor: expiryInfo.color },
                  ]}
                />
                <Text style={styles.expiryLabel}>{expiryInfo.label}</Text>
              </View>
            )}
          </View>
          <Text style={disabled ? styles.disabledItem : { fontSize: 16 }}>
            {"\u00D7"} {item.checked ? item.checkedCount : item.quantityDisplay}
            {item.unit}
          </Text>
        </View>
      </>
    );

    return useContainer ? (
      <View key={item.id} style={styles.itemContainer}>
        {content}
      </View>
    ) : (
      <View
        key={item.id}
        className="flex-row justify-between items-center mb-3 gap-3"
      >
        {content}
      </View>
    );
  };

  const ItemGroup = ({
    title,
    items,
    onClear,
    footer,
  }: {
    title: string;
    items: ListItem[];
    onClear?: () => void;
    footer?: React.ReactNode;
  }) => (
    <View style={styles.listContainer}>
      <View className="flex-row justify-between items-center mb-4">
        <Text style={styles.containerLabel}>{title}</Text>
        {onClear && (
          <Pressable onPress={onClear}>
            <Text style={{ color: Colors.text.light }}>Clear</Text>
          </Pressable>
        )}
      </View>

      {items.map((item) =>
        renderListItem(item, true, false, title !== "Expired Items")
      )}

      {footer}
    </View>
  );

  return (
    <>
      <BottomSheetModal
        isVisible={showAddModal}
        onClose={() => setFieldState("showAddModal", false)}
        modalStyle={onboardingStyles.optionModal}
        zIndex={12}
      >
        <SearchWithSuggestion
          onSelectItem={(itemName: string) => addItemToList(itemName)}
          mode={"suggestion-then-custom"}
          placeholder={"Ingredient"}
          suggestionType={"ingredient"}
        />
      </BottomSheetModal>

      <BottomSheetModal
        isVisible={showInventoryModal}
        onClose={() =>
          setFields({
            showInventoryModal: false,
            formDrafts: {},
          })
        }
        modalStyle={[
          onboardingStyles.optionModal,
          { paddingBottom: 60, ...(keyboardVisible && { flex: 1 }) },
        ]}
        zIndex={12}
      >
        {listData.checkedItems?.[lists.currentStepIndex] && (
          <InventoryModalContainer
            lists={lists}
            listData={listData}
            handleMoveToInventory={handleMoveToInventory}
          />
        )}
      </BottomSheetModal>

      {showAmountModal && (
        <Modal transparent animationType="fade" statusBarTranslucent>
          <AmountModalContainer
            lists={lists}
            handleInventoryCheck={handleInventoryCheck}
          />
        </Modal>
      )}

      <View style={homeStyles.container}>
        <View style={[homeStyles.header, styles.header]}>
          <View className="flex-row justify-between items-center w-full">
            <Text style={plannerStyles.headerTitle}>Lists</Text>
            <View className="flex-row items-center gap-1">
              <Pressable onPress={() => {}}>
                <IconSymbol name="bell" color={Colors.brand.primary} />
              </Pressable>
              <Pressable>
                <IconSymbol name="ellipsis" color={Colors.brand.primary} />
              </Pressable>
            </View>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 130 }}
        >
          <View className="px-4 pt-3">
            <View className="flex-row gap-5">
              {LIST_TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <Pressable
                    key={tab}
                    onPress={() => setFieldState("activeTab", tab)}
                  >
                    <View className="items-center">
                      <Text
                        style={{
                          fontFamily: isActive
                            ? "RobotoMedium"
                            : "RobotoRegular",
                          color: isActive
                            ? Colors.brand.primary
                            : Colors.text.disabled,
                          fontSize: 18,
                        }}
                      >
                        {capitalize(tab)}
                      </Text>
                      {isActive && <View style={styles.border} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <View className="flex-row justify-between mt-6">
              <Text className="text-[14px]">{uncheckedItems.length} items</Text>
              <View className="flex-row gap-1">
                <Text style={styles.filterText}>Name</Text>
                <IconSymbol
                  name="chevron.down"
                  color={Colors.text.disabled}
                  size={20}
                />
              </View>
            </View>
          </View>

          <View className="px-4 mt-4">
            {uncheckedItems.length === 0 ? (
              <Pressable
                onPress={() => setFieldState("showAddModal", true)}
                style={styles.addItemButton}
              >
                <Text style={styles.addItemText}>+ Add Items</Text>
              </Pressable>
            ) : (
              uncheckedItems.map((item) => renderListItem(item, false))
            )}
          </View>

          {expiredItems.length > 0 && (
            <ItemGroup
              title="Expired Items"
              items={expiredItems}
              onClear={() => handleClearItems(expiredItems, true)}
            />
          )}

          {checkedItems.length > 0 && (
            <ItemGroup
              title={
                activeTab === "shopping" ? "Checked Items" : "Finished Items"
              }
              items={checkedItems}
              onClear={
                activeTab === "inventory"
                  ? () => handleClearItems(checkedItems, false)
                  : undefined
              }
              footer={
                activeTab === "shopping" && (
                  <Pressable
                    className="rounded-full w-full py-3 items-center justify-center mt-5"
                    style={styles.addInventoryButton}
                    onPress={() => setFieldState("showInventoryModal", true)}
                  >
                    <Text style={styles.addInventoryText}>
                      Add to Inventory
                    </Text>
                  </Pressable>
                )
              }
            />
          )}
        </ScrollView>

        <Pressable
          onPress={() => setFieldState("showAddModal", true)}
          style={plannerStyles.generateButton}
        >
          <IconSymbol name="plus" color={Colors.brand.onPrimary} size={22} />
        </Pressable>
      </View>
    </>
  );
}
