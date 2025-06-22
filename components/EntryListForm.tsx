import { EntryController } from "@/app/create/createForm/component";
import { CreateFormState } from "@/app/create/createForm/controller";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useFieldState } from "@/hooks/useFieldState";
import { useSuggestionList } from "@/hooks/useSuggestionList";
import { styles } from "@/utility/create/styles";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export type EntryType = "ingredient" | "category" | "area";

type EntryListProps = {
  type: EntryType;
  create: ReturnType<typeof useFieldState<CreateFormState>>;
  controller: EntryController;
  placeholder: string;
  label?: string;
};

type EntryItem = { name: string; quantity?: string };

const EntryListForm = ({
  type,
  create,
  controller,
  placeholder,
  label,
}: EntryListProps) => {
  const { focusedIndex, setFieldState, area } = create;
  const { getSuggestions } = useSuggestionList(type);

  const isSingleEntry = type === "area";
  const entries: EntryItem[] = isSingleEntry
    ? [{ name: area || "" }]
    : (create[type] as EntryItem[]);

  const handleFocus = (index: number | null) =>
    setFieldState("focusedIndex", { [type]: index });

  const handleChange = (index: number, field: keyof EntryItem, value: string) =>
    controller.updateEntry(type, index, field, value);

  const handleSelect = (index: number, suggestion: string) =>
    controller.selectSuggestion(type, index, suggestion);

  const handleClear = () => setFieldState(type, isSingleEntry ? "" : []);

  const showSuggestions = (index: number, value: string) => {
    const suggestions = getSuggestions(value);
    const isFocused = focusedIndex?.[type] === index;
    if (!isFocused || suggestions.length === 0) return null;

    const width =
      type === "category" ? "93%" : isSingleEntry ? "100%" : "68.5%";

    return (
      <View style={[styles.suggestionBox, { width }]}>
        {suggestions.map((suggestion) => (
          <TouchableOpacity
            key={suggestion}
            onPress={() => handleSelect(index, suggestion)}
            className="px-3 py-2"
          >
            <Text>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderEntryRow = (item: EntryItem, index: number) => (
    <View key={index} className="relative mb-3">
      <View className="flex-row items-center gap-2">
        <TextInput
          value={item.name}
          placeholder={placeholder}
          onFocus={() => handleFocus(index)}
          onBlur={() => handleFocus(null)}
          onChangeText={(text) => handleChange(index, "name", text)}
          style={styles.inputValue}
          placeholderTextColor={Colors.text.disabled}
        />
        {type === "ingredient" && (
          <TextInput
            value={item.quantity}
            placeholder="Qty"
            onChangeText={(text) => handleChange(index, "quantity", text)}
            style={styles.inputQuantity}
            placeholderTextColor={Colors.text.disabled}
          />
        )}
        {!isSingleEntry && (
          <TouchableOpacity
            onPress={() => controller.modifyEntry(type, "remove", index)}
          >
            <IconSymbol
              name="multiply.circle.fill"
              size={20}
              color={Colors.brand.primary}
            />
          </TouchableOpacity>
        )}
      </View>
      {showSuggestions(index, item.name)}
    </View>
  );

  const hasItems = isSingleEntry ? !!area : entries.length > 0;

  return (
    <>
      <View className="flex-row justify-between items-center">
        <Text style={styles.inputTitle}>
          {label ?? type.charAt(0).toUpperCase() + type.slice(1)}
        </Text>
        {hasItems && (
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.linkText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {entries.map(renderEntryRow)}

      {!isSingleEntry && (
        <TouchableOpacity
          onPress={() => controller.modifyEntry(type, "add")}
          className="mb-6 mt-2"
        >
          <Text style={{ color: Colors.brand.primary }}>+ Add {type}</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default EntryListForm;
