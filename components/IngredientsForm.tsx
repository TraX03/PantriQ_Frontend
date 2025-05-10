import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { styles } from "@/utility/create/styles";
import { useIngredientSuggestions } from "@/hooks/useIngredientSuggestions";
import { CreateFormState } from "@/app/create/createForm/component";

type Props = {
  create: ReturnType<
    typeof import("@/hooks/useFieldState").useFieldState<CreateFormState>
  >;
  controller: {
    updateIngredient: (
      index: number,
      field: "name" | "quantity",
      value: string
    ) => void;
    removeIngredient: (index: number) => void;
    addIngredient: () => void;
    selectSuggestion: (index: number, suggestion: string) => void;
  };
};

export default function IngredientsForm({ create, controller }: Props) {
  const { ingredients, focusedIndex, setFieldState } = create;
  const { getSuggestions } = useIngredientSuggestions();

  return (
    <>
      <View className="flex-row justify-between items-center">
        <Text style={styles.inputTitle}>Ingredients</Text>
        {ingredients.length > 0 && (
          <TouchableOpacity onPress={() => setFieldState("ingredients", [])}>
            <Text style={styles.linkText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {ingredients.map((item, index) => {
        const suggestions = getSuggestions(item.name);

        return (
          <View key={index} className="relative mb-3">
            <View className="flex-row items-center gap-2">
              <TextInput
                value={item.name}
                onFocus={() => setFieldState("focusedIndex", index)}
                onBlur={() => setFieldState("focusedIndex", null)}
                onChangeText={(text) =>
                  controller.updateIngredient(index, "name", text)
                }
                placeholder="Ingredient"
                style={styles.inputIngredient}
              />
              <TextInput
                value={item.quantity}
                onChangeText={(text) =>
                  controller.updateIngredient(index, "quantity", text)
                }
                placeholder="Qty"
                style={styles.inputQuantity}
              />
              <TouchableOpacity
                onPress={() => controller.removeIngredient(index)}
              >
                <IconSymbol
                  name="multiply.circle.fill"
                  size={20}
                  color={Colors.brand.main}
                />
              </TouchableOpacity>
            </View>

            {focusedIndex === index && suggestions.length > 0 && (
              <View style={styles.suggestionBox}>
                {suggestions.map((suggestion) => (
                  <TouchableOpacity
                    key={suggestion}
                    onPress={() =>
                      controller.selectSuggestion(index, suggestion)
                    }
                    className="px-3 py-2"
                  >
                    <Text>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        );
      })}

      <TouchableOpacity
        onPress={controller.addIngredient}
        className="mb-5 mt-2"
      >
        <Text style={{ color: Colors.brand.main }}>+ Add Ingredient</Text>
      </TouchableOpacity>
    </>
  );
}
