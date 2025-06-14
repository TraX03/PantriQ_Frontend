import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useFieldState } from "@/hooks/useFieldState";
import { styles as homeStyles } from "@/utility/home/styles";
import { styles } from "@/utility/lists/styles";
import { styles as onboardingStyles } from "@/utility/onboarding/styles";
import { styles as plannerStyles } from "@/utility/planner/styles";

import BottomSheetModal from "@/components/BottomSheetModal";
import SearchWithSuggestion from "@/components/SearchWithSuggestions";
import { Pressable, Text, View } from "react-native";
import { ListsState } from "./controller";

type Props = {
  lists: ReturnType<typeof useFieldState<ListsState>>;
  addItemToList: (name: string, quantity?: number) => Promise<void>;
};

export default function ListsComponent({ lists, addItemToList }: Props) {
  const { activeTab, showAddModal, items, setFieldState } = lists;

  return (
    <>
      <BottomSheetModal
        isVisible={showAddModal}
        onClose={() => setFieldState("showAddModal", false)}
        modalStyle={onboardingStyles.optionModal}
        zIndex={10}
      >
        <SearchWithSuggestion
          onSelectItem={(itemName: string) => addItemToList(itemName)}
          mode={"suggestion-then-custom"}
          placeholder={"Ingredient"}
          suggestionType={"ingredient"}
        />
      </BottomSheetModal>

      <View style={homeStyles.container}>
        <View style={[homeStyles.header, styles.header]}>
          <View className="flex-row justify-between items-center w-full">
            <Text style={plannerStyles.headerTitle}>Lists</Text>
            <View className="flex-row items-center gap-1">
              <Pressable onPress={() => {}}>
                <IconSymbol name="bell" color={Colors.brand.primary} />
              </Pressable>
              <Pressable>
                <IconSymbol
                  name="ellipsis"
                  color={Colors.brand.primary}
                  selectedIcon={0}
                />
              </Pressable>
            </View>
          </View>
        </View>

        <View className="px-4 pt-3">
          <View className="flex-row gap-5">
            {["Shopping", "Inventory"].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <Pressable
                  key={tab}
                  onPress={() =>
                    setFieldState("activeTab", tab as ListsState["activeTab"])
                  }
                >
                  <View className="items-center">
                    <Text
                      style={{
                        fontFamily: isActive ? "RobotoMedium" : "RobotoRegular",
                        color: isActive
                          ? Colors.brand.primary
                          : Colors.text.dim,
                        fontSize: 20,
                      }}
                    >
                      {tab}
                    </Text>
                    {isActive && <View style={styles.border} />}
                  </View>
                </Pressable>
              );
            })}
          </View>
          <View className="flex-row justify-between mt-5">
            <Text style={{ fontSize: 16 }}>3 items</Text>
            <View className="flex-row gap-1">
              <Text style={{ fontSize: 16, color: Colors.text.dim }}>Name</Text>
              <IconSymbol
                name="chevron.down"
                color={Colors.text.dim}
                size={22}
              />
            </View>
          </View>
        </View>
        <View className="px-4 mt-6">
          {items.length === 0 ? (
            <Pressable
              onPress={() => setFieldState("showAddModal", true)}
              className="rounded-full w-full py-3 items-center justify-center"
              style={{ elevation: 2, backgroundColor: Colors.brand.onPrimary }}
            >
              <Text
                style={{
                  color: Colors.brand.primary,
                  fontFamily: "RobotoMedium",
                  fontSize: 16,
                }}
              >
                + Add Items
              </Text>
            </Pressable>
          ) : (
            items
              .filter((item) => item.type === activeTab)
              .map((item, index) => (
                <View
                  key={index}
                  className="flex-row justify-between items-center mb-2 px-4 py-3 rounded-lg"
                  style={{ backgroundColor: "white", elevation: 1 }}
                >
                  <View className="flex-row items-center gap-2">
                    <IconSymbol
                      name={
                        item.checked
                          ? "checkmark.square.fill"
                          : "checkmark.square"
                      }
                      color={Colors.brand.primary}
                    />
                    <Text style={{ fontSize: 16 }}>{item.name}</Text>
                  </View>
                  <Text style={{ fontSize: 16 }}>{item.quantity}</Text>
                </View>
              ))
          )}
        </View>
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
