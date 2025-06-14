import HeaderBar from "@/components/HeaderBar";
import SearchWithSuggestion from "@/components/SearchWithSuggestions";
import { styles } from "@/utility/profile/styles";
import { Stack } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  regionPreferences: string[] | null;
  handleSave: (newPreferences: string[]) => Promise<void>;
};

export default function EditPreferencesComponent({
  regionPreferences,
  handleSave,
}: Props) {
  const [selectedItems, setSelectedItems] = useState<string[]>(
    regionPreferences ?? []
  );

  const normalized = (text: string) => text.toLowerCase();

  const toggleItem = (item: string) => {
    const normalizedItem = normalized(item);
    const updatedItems = selectedItems.some(
      (i) => normalized(i) === normalizedItem
    )
      ? selectedItems.filter((i) => normalized(i) !== normalizedItem)
      : [...selectedItems, item];

    setSelectedItems(updatedItems);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView style={styles.headerContainer}>
        <HeaderBar title={"Edit Preferences"} />
        <View style={{ padding: 16 }}>
          {selectedItems.length > 0 ? (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {selectedItems.map((region, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "#ccc",
                    borderWidth: 1,
                    borderRadius: 20,
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                  }}
                >
                  <Text style={{ color: "#333" }}>{region}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ marginTop: 8, color: "#999" }}>No preferences</Text>
          )}
        </View>
        <View className="h-96">
          <SearchWithSuggestion
            onSelectItem={toggleItem}
            mode={"suggestion-then-custom"}
            placeholder={"Cuisine"}
            suggestionType={"area"}
          />
        </View>
        <View className="mr-3">
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => handleSave(selectedItems)}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
