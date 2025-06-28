import RecipeStep from "@/components/RecipeStep";
import ScoreCircle from "@/components/ScoreCircle";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { Routes } from "@/constants/Routes";
import { useFieldState } from "@/hooks/useFieldState";
import { capitalize } from "@/utility/capitalize";
import { styles } from "@/utility/content/posts/styles";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { PostState, RecipePost } from "../controller";
import { RecipeState } from "./controller";

type Props = {
  post: ReturnType<typeof useFieldState<PostState>>;
  recipe: ReturnType<typeof useFieldState<RecipeState>>;
  recipeData: RecipePost;
  getNutritionEntry: (
    data: any,
    key: "nutrients" | "properties",
    name: string
  ) => {
    amount: number;
    unit: string;
  };
};

export default function RecipeComponent({
  post,
  recipe,
  recipeData,
  getNutritionEntry,
}: Props) {
  const { postData, setFieldState } = post;
  const { nutritionData, expanded, isInstructionsOverflow } = recipe;

  const nutrients = {
    calories: getNutritionEntry(nutritionData, "nutrients", "Calories"),
    fat: getNutritionEntry(nutritionData, "nutrients", "Fat"),
    carbs: getNutritionEntry(nutritionData, "nutrients", "Carbohydrates"),
  };

  const rounded = {
    calories: Math.round(nutrients.calories.amount),
    fat: Math.round(nutrients.fat.amount),
    carbs: Math.round(nutrients.carbs.amount),
  };

  return (
    <>
      {!!postData?.description && (
        <View style={styles.contentContainer}>
          <Text className="text-base">{postData.description}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.nutrientContainer}
        onPress={() =>
          router.push({
            pathname: Routes.Nutrition,
            params: { recipeId: recipeData.id },
          })
        }
      >
        <View className="flex-col flex-1">
          <View className="flex-row items-center">
            <View className="flex-row items-center px-7 flex-1">
              <ScoreCircle score={nutritionData?.healthScore ?? 0} />

              <View className="ml-8 gap-3">
                <View className="items-center mx-2">
                  <Text className="text-[15px]">
                    {rounded.calories} {nutrients.calories.unit}
                  </Text>
                  <Text style={styles.nutrientLabel}>Calories</Text>
                </View>

                <View className="flex-row gap-4">
                  {[
                    {
                      label: "Carbs",
                      value: rounded.carbs,
                      unit: nutrients.carbs.unit,
                    },
                    {
                      label: "Fat",
                      value: rounded.fat,
                      unit: nutrients.fat.unit,
                    },
                  ].map(({ label, value, unit }) => (
                    <View key={label} className="items-center mx-2">
                      <Text className="text-[15px]">{`${value} ${unit}`}</Text>
                      <Text style={styles.nutrientLabel}>{label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
            <IconSymbol
              name="chevron.right"
              color={Colors.overlay.base}
              size={25}
            />
          </View>
          <Text style={styles.disclaimerText}>
            Nutrient data is auto-generated and may be inaccurate.
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Ingredients</Text>

        <View
          style={!expanded ? { maxHeight: 150, overflow: "hidden" } : undefined}
        >
          {recipeData.ingredients.map(({ name, quantity, note }, index) => (
            <View key={index} className="flex-col mb-4">
              <View className="flex-row justify-between">
                <Text style={styles.ingredientName}>{capitalize(name)}</Text>
                <Text style={styles.quantityName}>{quantity}</Text>
              </View>
              {note && (
                <Text style={{ color: Colors.brand.primaryDark, fontSize: 14 }}>
                  {capitalize(note)}
                </Text>
              )}
            </View>
          ))}
        </View>

        {recipeData.ingredients.length > 5 && (
          <TouchableOpacity
            onPress={() => recipe.setFieldState("expanded", !expanded)}
            className="mt-3 self-end"
          >
            <Text style={styles.buttonText}>
              {expanded ? "View Less" : "View More"}
            </Text>
          </TouchableOpacity>
        )}

        <View className="mt-7">
          <Text style={styles.sectionTitle}>Instructions</Text>

          <View style={{ maxHeight: 270 }}>
            <ScrollView
              scrollEnabled={false}
              onContentSizeChange={(_, height) =>
                recipe.setFieldState("isInstructionsOverflow", height > 270)
              }
            >
              {recipeData.instructions.filter(Boolean).map((step, index) => (
                <RecipeStep key={index} index={index} step={step} />
              ))}
            </ScrollView>
          </View>

          {isInstructionsOverflow && (
            <TouchableOpacity
              onPress={() => setFieldState("showStepsModal", true)}
              className="mt-4 self-end"
            >
              <Text style={styles.buttonText}>View All Steps</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
}
