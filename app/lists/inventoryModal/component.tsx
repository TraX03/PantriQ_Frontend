import CustomPicker from "@/components/CustomPicker";
import InputBox from "@/components/InputBox";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { styles } from "@/utility/lists/styles";
import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { UNIT_CONVERSIONS } from "../controller";
import { ContainerProps } from "./container";
import { BatchUpdate, SingleUpdate } from "./controller";

type Props = ContainerProps & {
  hasMismatch: {
    hasExpiryMismatch: (expiries: string[], quantityCount: number) => boolean;
    hasQuantityMismatch: (
      quantityText: string[],
      units: string[],
      checkedCount: number
    ) => boolean;
  };
  modifyDraftFieldAtIndex: (update: SingleUpdate | BatchUpdate) => void;
};

export default function InventoryModalComponent({
  lists,
  listData,
  handleMoveToInventory,
  hasMismatch,
  modifyDraftFieldAtIndex,
}: Props) {
  const {
    setFieldState,
    currentStepIndex,
    showDatePicker,
    datePickerIndex,
    formDrafts,
  } = lists;
  const { checkedItems } = listData;

  const selectedItem = checkedItems[currentStepIndex];

  const currentDraft = formDrafts?.[currentStepIndex] ?? {
    quantity: undefined,
    unit: [""],
    expiries: [""],
  };

  const quantityArray = Array.isArray(selectedItem?.quantity)
    ? selectedItem.quantity
    : [selectedItem?.quantity ?? 1];

  const hasExpiryMismatch = hasMismatch.hasExpiryMismatch(
    currentDraft.expiries ?? [],
    quantityArray.length
  );

  const hasQuantityMismatch = hasMismatch.hasQuantityMismatch(
    currentDraft.quantityText ?? [],
    currentDraft.unit ?? [],
    selectedItem.checkedCount ?? 0
  );

  const isDisabled = hasExpiryMismatch || hasQuantityMismatch;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center">
        <Text className="text-[16px]">
          <Text style={{ fontFamily: "RobotoMedium" }}>Item: </Text>
          {checkedItems[currentStepIndex].name}{" "}
        </Text>
        <Text style={styles.lightLabel}>
          (x{checkedItems[currentStepIndex].checkedCount})
        </Text>
      </View>

      <View className="flex-row items-baseline mt-3">
        <Text style={styles.label}>Quantity </Text>
        <Text style={styles.lightLabel}>(optional)</Text>
      </View>
      <Text style={styles.description}>
        Only for measurable items (e.g. 1L milk).
      </Text>

      {hasQuantityMismatch && (
        <Text style={styles.errorText}>
          *Quantity entries must match item quantity (
          {checkedItems[currentStepIndex].quantityDisplay}) and unit cannot be
          empty
        </Text>
      )}

      {(currentDraft.quantityText ?? [""]).map((qt, index) => (
        <View key={index} className="flex-row items-center gap-2 mb-2">
          <InputBox
            placeholder="Quantity"
            keyboardType="decimal-pad"
            value={qt}
            onChangeText={(text) => {
              modifyDraftFieldAtIndex({
                updates: [
                  { field: "quantityText", index, value: text },
                  {
                    field: "quantity",
                    index,
                    value: parseFloat(text.replace(",", ".")),
                  },
                ],
              });
            }}
            containerStyle={styles.inputContainer}
          />

          <CustomPicker
            selectedValue={currentDraft.unit?.[index] ?? ""}
            onValueChange={(value) =>
              modifyDraftFieldAtIndex({ field: "unit", index, value })
            }
            options={Object.keys(UNIT_CONVERSIONS)}
            style={{ flex: 1, height: 40, maxWidth: "25%" }}
          />

          {(currentDraft.quantityText?.length ?? 0) > 1 && (
            <>
              <Pressable
                onPress={() =>
                  modifyDraftFieldAtIndex({
                    updates: [
                      { field: "quantityText", index },
                      { field: "quantity", index },
                      { field: "unit", index },
                    ],
                  })
                }
              >
                <IconSymbol
                  name="multiply.circle.fill"
                  size={20}
                  color={Colors.brand.primary}
                />
              </Pressable>
              <Pressable
                onPress={() =>
                  modifyDraftFieldAtIndex({
                    updates: [
                      {
                        field: "quantityText",
                        index,
                        value: currentDraft.quantityText?.[index] ?? "",
                        insertAfter: true,
                      },
                      {
                        field: "quantity",
                        index,
                        value: currentDraft.quantity?.[index] ?? 0,
                        insertAfter: true,
                      },
                      {
                        field: "unit",
                        index,
                        value: currentDraft.unit?.[index] ?? "",
                        insertAfter: true,
                      },
                    ],
                  })
                }
              >
                <IconSymbol
                  name="plus.rectangle.on.rectangle"
                  size={20}
                  color={Colors.brand.primary}
                />
              </Pressable>
            </>
          )}
        </View>
      ))}

      {(checkedItems[currentStepIndex]?.checkedCount ?? 0) > 1 && (
        <Pressable
          onPress={() =>
            modifyDraftFieldAtIndex({
              updates: [
                {
                  field: "quantityText",
                  index: (currentDraft.quantityText?.length ?? 0) - 1,
                  value: "",
                  insertAfter: true,
                },
                {
                  field: "quantity",
                  index: (currentDraft.quantity?.length ?? 0) - 1,
                  value: 0,
                  insertAfter: true,
                },
              ],
            })
          }
        >
          <Text style={styles.adddText}>+ Add Quantity</Text>
        </Pressable>
      )}

      <View className="flex-row items-baseline mb-1">
        <Text style={styles.label}>Expiry Date </Text>
        <Text style={styles.lightLabel}>(optional)</Text>
      </View>

      {hasExpiryMismatch && (
        <Text style={styles.errorText}>
          *Expiry entries must match item quantity (
          {checkedItems[currentStepIndex].quantityDisplay})
        </Text>
      )}

      {(currentDraft.expiries ?? [""]).map((date, index) => (
        <View key={index} style={styles.expiryContainer}>
          <TouchableOpacity
            onPress={() => {
              setFieldState("datePickerIndex", index);
              setFieldState("showDatePicker", true);
            }}
            style={styles.dateInputContainer}
          >
            <Text
              style={{
                color: date ? Colors.text.primary : Colors.text.disabled,
              }}
            >
              {date
                ? new Date(date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Select expiry date"}
            </Text>
          </TouchableOpacity>

          {(currentDraft.expiries?.length ?? 0) > 1 && (
            <>
              <Pressable
                onPress={() =>
                  modifyDraftFieldAtIndex({ field: "expiries", index })
                }
              >
                <IconSymbol
                  name="multiply.circle.fill"
                  size={20}
                  color={Colors.brand.primary}
                />
              </Pressable>
              <Pressable
                onPress={() =>
                  modifyDraftFieldAtIndex({
                    field: "expiries",
                    index,
                    value: currentDraft.expiries?.[index] ?? "",
                    insertAfter: true,
                  })
                }
              >
                <IconSymbol
                  name="plus.rectangle.on.rectangle"
                  size={20}
                  color={Colors.brand.primary}
                />
              </Pressable>
            </>
          )}
        </View>
      ))}

      {showDatePicker && (
        <DateTimePicker
          value={
            currentDraft.expiries?.[datePickerIndex]
              ? new Date(currentDraft.expiries[datePickerIndex])
              : new Date()
          }
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setFieldState("showDatePicker", false);
            if (event.type === "set" && selectedDate) {
              modifyDraftFieldAtIndex({
                field: "expiries",
                index: datePickerIndex,
                value: selectedDate.toISOString(),
              });
            }
          }}
        />
      )}

      {(checkedItems[currentStepIndex]?.checkedCount ?? 0) > 1 && (
        <Pressable
          onPress={() =>
            modifyDraftFieldAtIndex({
              field: "expiries",
              index: (currentDraft.expiries?.length ?? 0) - 1,
              value: "",
              insertAfter: true,
            })
          }
        >
          <Text style={styles.adddText}>+ Add Expiry Date</Text>
        </Pressable>
      )}

      <View className="flex-row justify-between mt-4">
        {currentStepIndex > 0 ? (
          <Pressable
            onPress={() =>
              setFieldState("currentStepIndex", currentStepIndex - 1)
            }
          >
            <Text style={styles.navigateText}>Previous</Text>
          </Pressable>
        ) : (
          <View className="w-[70px]" />
        )}

        <Pressable
          disabled={isDisabled}
          onPress={
            currentStepIndex < checkedItems.length - 1
              ? () => setFieldState("currentStepIndex", currentStepIndex + 1)
              : handleMoveToInventory
          }
        >
          <Text
            style={{
              color: isDisabled ? Colors.text.disabled : Colors.text.link,
              fontSize: 15,
            }}
          >
            {currentStepIndex < checkedItems.length - 1 ? "Next" : "Submit"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
