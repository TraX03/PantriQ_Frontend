import OnboardingPage from "@/components/Onboarding";
import { Mode } from "@/components/SearchWithSuggestions";
import { Colors } from "@/constants/Colors";
import { useFieldState } from "@/hooks/useFieldState";
import { SuggestionType } from "@/hooks/useSuggestionList";
import { styles } from "@/utility/onboarding/styles";
import { Stack } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { OnboardingState } from "./controller";

export const pages: {
  title: string;
  description: string;
  suggestions: string[];
  placeholder: string;
  mode: Mode;
  suggestionType?: SuggestionType;
}[] = [
  {
    title: "Any ingredient to avoid?",
    description:
      "Tell us if there are any ingredients you'd like to avoid, and we'll tailor your meal plan accordingly.",
    suggestions: [
      "Chicken",
      "Beef",
      "Eggs",
      "Soy",
      "Peanuts",
      "Wheat",
      "Milk",
      "Fish",
    ],
    placeholder: "Ingredient",
    mode: "suggestion-then-custom",
    suggestionType: "ingredient",
  },
  {
    title: "Do you follow any of these diets?",
    description:
      "Share your diet preferences so we can personalize your meal plan to match your needs.",
    suggestions: [
      "Vegan",
      "Paleo",
      "Low-Carb",
      "Vegetarian",
      "Keto",
      "Mediterranean",
      "Dairy Free",
      "Gluten Free",
    ],
    placeholder: "Diet",
    mode: "datamuse-only",
  },
  {
    title: "Which cuisine best matches your daily meals?",
    description:
      "Tell us which cuisine you eat most often so we can personalize your meal plan.",
    suggestions: [
      "Italian",
      "British",
      "Thai",
      "Indian",
      "Japanese",
      "Chinese",
      "Malaysian",
      "American",
    ],
    placeholder: "Cuisine",
    mode: "suggestion-then-custom",
    suggestionType: "area",
  },
];

type Props = {
  onboarding: ReturnType<typeof useFieldState<OnboardingState>>;
  handleNext: () => void;
  handlePrevious: () => void;
  addCustomSuggestion: (pageIndex: number, suggestion: string) => void;
  isNextEnabled: boolean;
};

export default function OnboardingComponent({
  onboarding,
  handleNext,
  handlePrevious,
  addCustomSuggestion,
  isNextEnabled,
}: Props) {
  const {
    currentPage,
    ingredientAvoid,
    diet,
    region,
    customSuggestions,
    setFieldState,
  } = onboarding;

  const pageIndex = currentPage - 1;
  const selectedStates = [ingredientAvoid, diet, region];
  const setters = [
    (value: typeof ingredientAvoid) => setFieldState("ingredientAvoid", value),
    (value: typeof diet) => setFieldState("diet", value),
    (value: typeof region) => setFieldState("region", value),
  ];

  const currentPageData = pages[pageIndex];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <View className="flex-row justify-between items-center mb-6 mt-4">
          <View className="flex-row gap-2">
            {pages.map((_, i) => {
              const step = i + 1;
              const isCurrent = step === currentPage;
              const isCompleted = step < currentPage;

              return (
                <View
                  key={step}
                  className="w-7 h-7 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: isCurrent
                      ? Colors.surface.buttonPrimary
                      : isCompleted
                      ? Colors.brand.onPrimary
                      : Colors.surface.backgroundMuted,
                    borderWidth: isCompleted ? 1 : 0,
                    borderColor: isCompleted
                      ? Colors.brand.onBackground
                      : "transparent",
                  }}
                >
                  <Text
                    style={[
                      styles.numText,
                      {
                        color: isCurrent
                          ? Colors.brand.onPrimary
                          : Colors.brand.onBackground,
                      },
                    ]}
                  >
                    {step}
                  </Text>
                </View>
              );
            })}
          </View>

          <Pressable onPress={handleNext}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        {currentPageData && (
          <OnboardingPage
            {...currentPageData}
            selectedItems={selectedStates[pageIndex]}
            onChange={setters[pageIndex]}
            customSuggestions={customSuggestions[pageIndex]}
            onAddCustomSuggestion={(item) =>
              addCustomSuggestion(pageIndex, item)
            }
          />
        )}

        <View className="flex-row justify-between mt-6">
          {currentPage > 1 ? (
            <Pressable
              style={[
                styles.button,
                { backgroundColor: Colors.surface.buttonSecondary },
              ]}
              onPress={handlePrevious}
            >
              <Text style={[styles.buttonText, { color: Colors.brand.onBackground }]}>
                Previous
              </Text>
            </Pressable>
          ) : (
            <View className="w-[100px]" />
          )}

          <Pressable
            style={[styles.button, { opacity: isNextEnabled ? 1 : 0.5 }]}
            onPress={isNextEnabled ? handleNext : undefined}
            disabled={!isNextEnabled}
          >
            <Text style={styles.buttonText}>Next</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}
