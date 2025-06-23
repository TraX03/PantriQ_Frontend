import BottomSheetModal from "@/components/BottomSheetModal";
import SearchWithSuggestion, { Mode } from "@/components/SearchWithSuggestions";
import SelectionList from "@/components/SelectionList";
import { Colors } from "@/constants/Colors";
import { useFieldState } from "@/hooks/useFieldState";
import { SuggestionType } from "@/hooks/useSuggestionList";
import { styles } from "@/utility/onboarding/styles";
import { Stack } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
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
  isNextEnabled: boolean;
  actions: {
    handleSelectItem: (item: string) => void;
    toggleItemSelection: (item: string) => void;
    getPageSuggestions: () => string[];
    handleNext: () => void;
    handlePrevious: () => void;
  };
};

export default function OnboardingComponent({
  onboarding,
  isNextEnabled,
  actions,
}: Props) {
  const {
    handleSelectItem,
    toggleItemSelection,
    getPageSuggestions,
    handleNext,
    handlePrevious,
  } = actions;
  const {
    currentPage,
    ingredientAvoid,
    diet,
    region,
    showSearchModal,
    setFieldState,
  } = onboarding;
  const pageIndex = currentPage - 1;
  const selectedStates = [ingredientAvoid, diet, region];
  const currentPageData = pages[pageIndex];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <BottomSheetModal
        isVisible={showSearchModal}
        onClose={() => setFieldState("showSearchModal", false)}
        modalStyle={styles.optionModal}
        zIndex={10}
      >
        <SearchWithSuggestion
          onSelectItem={handleSelectItem}
          mode={currentPageData.mode}
          placeholder={currentPageData.placeholder}
          suggestionType={currentPageData.suggestionType}
        />
      </BottomSheetModal>

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
          <>
            <View>
              <Text style={styles.title}>{currentPageData.title}</Text>
              <Text style={styles.description}>
                {currentPageData.description}
              </Text>
            </View>

            <View className="mt-7 flex-1">
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerClassName="flex-row flex-wrap gap-2.5"
              >
                <SelectionList
                  getPageSuggestions={getPageSuggestions}
                  toggleItemSelection={toggleItemSelection}
                  selectedItems={selectedStates[currentPage - 1]}
                  onOpenModal={() => setFieldState("showSearchModal", true)}
                />
              </ScrollView>
            </View>
          </>
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
              <Text
                style={[
                  styles.buttonText,
                  { color: Colors.brand.onBackground },
                ]}
              >
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
