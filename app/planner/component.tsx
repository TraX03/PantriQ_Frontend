import ActionSheetModal from "@/components/ActionSheetModal";
import BottomSheetModal from "@/components/BottomSheetModal";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { Routes } from "@/constants/Routes";
import { useFieldState } from "@/hooks/useFieldState";
import { capitalize } from "@/utility/capitalize";
import { styles as homeStyles } from "@/utility/home/styles";
import { getImageUrl } from "@/utility/imageUtils";
import { styles } from "@/utility/planner/styles";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDays, endOfWeek, format, isThisWeek, startOfDay } from "date-fns";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { availableMealtimes, Meal, PlannerState } from "./controller";

type DateInfo = {
  minDate: Date;
  weekStart: Date;
};

type Props = {
  planner: ReturnType<typeof useFieldState<PlannerState>>;
  date: DateInfo;
  actions: {
    generateMeals: (
      mealtimes: string[],
      targetRecipeId?: string,
      isRegenerate?: boolean
    ) => Promise<void>;
    handleChangeWeek: (direction: "prev" | "next") => void;
    getCachedMealsForDate: (date: Date) => Meal[];
    addMealtime: (mealtime: string) => void;
    deleteFromMealplan: (mealtime: string, recipeId?: string) => Promise<void>;
  };
};

export default function PlannerComponent({ planner, date, actions }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const {
    selectedDate,
    showDatePicker,
    setFieldState,
    setFields,
    showMealtimeModal,
    planLoading,
    generateLoading,
    showSettingModal,
    selectedMealtime,
    showRegenerateButton,
    showDeleteButton,
  } = planner;
  const {
    generateMeals,
    handleChangeWeek,
    getCachedMealsForDate,
    addMealtime,
    deleteFromMealplan,
  } = actions;
  const { weekStart, minDate } = date;

  const formattedWeek = isThisWeek(selectedDate, { weekStartsOn: 1 })
    ? "This Week"
    : `${format(weekStart, "MMM d")} — ${format(
        endOfWeek(selectedDate, { weekStartsOn: 1 }),
        "MMM d"
      )}`;

  return (
    <>
      <BottomSheetModal
        isVisible={showMealtimeModal}
        onClose={() => setFieldState("showMealtimeModal", false)}
        options={availableMealtimes
          .filter((meal) => meal.id !== "all")
          .map((meal) => ({
            key: meal.id,
            label: meal.label,
            onPress: () => addMealtime(meal.id),
            testID: `mealtime-option-${meal.id}`,
          }))}
        zIndex={20}
        modalStyle={styles.mealtimeModal}
      />

      <ActionSheetModal
        visible={showSettingModal}
        onClose={() => setFieldState("showSettingModal", false)}
        options={[
          {
            label: "Regenerate Dish",
            action: () =>
              setFields({
                showDeleteButton: false,
                showRegenerateButton: true,
              }),
          },
          {
            label: "Regenerate Mealtime",
            action: () =>
              selectedMealtime &&
              generateMeals([selectedMealtime], undefined, true),
          },
          {
            label: "Delete Dish",
            isDestructive: true,
            action: () =>
              setFields({
                showRegenerateButton: false,
                showDeleteButton: true,
              }),
          },
          {
            label: "Delete Mealtime",
            isDestructive: true,
            action: () =>
              selectedMealtime && deleteFromMealplan(selectedMealtime),
          },
        ]}
      />

      <View style={homeStyles.container}>
        <View style={homeStyles.header}>
          <View className="flex-row justify-between items-center w-full">
            <Text style={styles.headerTitle}>Meal Planner</Text>
            <View className="flex-row items-center gap-2">
              <Pressable
                onPress={() => {
                  setFieldState("selectedDate", new Date());
                  scrollRef.current?.scrollTo({ y: 0, animated: true });
                }}
              >
                <IconSymbol
                  name="arrow.clockwise.circle"
                  color={Colors.brand.primary}
                />
              </Pressable>
              <Pressable
                testID="meal-config-button"
                onPress={() => {
                  router.push(Routes.MealConfiguration);
                }}
              >
                <IconSymbol
                  name="ellipsis.circle"
                  color={Colors.brand.primary}
                />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.weekContainer}>
          <Pressable onPress={() => handleChangeWeek("prev")}>
            <IconSymbol name="chevron.left" color={Colors.brand.primary} />
          </Pressable>

          <TouchableOpacity
            onPress={() => setFieldState("showDatePicker", true)}
          >
            <Text style={styles.weekText}>{formattedWeek}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              minimumDate={minDate}
              onChange={(event, date) => {
                if (event.type === "set") {
                  setFieldState("showDatePicker", false);
                  if (date) setFieldState("selectedDate", startOfDay(date));
                }
              }}
            />
          )}

          <Pressable onPress={() => handleChangeWeek("next")}>
            <IconSymbol name="chevron.right" color={Colors.brand.primary} />
          </Pressable>
        </View>

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 130 }}
        >
          <View className="mt-2 py-1.5">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 13 }}
            >
              {Array.from({ length: 7 }).map((_, index) => {
                const day = addDays(weekStart, index);
                const isSelected =
                  format(day, "yyyy-MM-dd") ===
                  format(selectedDate, "yyyy-MM-dd");
                const isEnabled = day >= minDate;

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (day < minDate) {
                        Toast.show({
                          type: "error",
                          text1: "Meal plan only retains the previous 30 days.",
                        });
                      } else {
                        setFieldState("selectedDate", startOfDay(day));
                      }
                    }}
                    className="px-4 py-1.5 mr-2.5 rounded-lg"
                    style={{
                      backgroundColor: isSelected
                        ? Colors.brand.primary
                        : Colors.text.placeholder,
                      opacity: isEnabled ? 1 : 0.4,
                    }}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        {
                          color: isSelected
                            ? Colors.brand.onPrimary
                            : Colors.text.primary,
                        },
                      ]}
                    >
                      {format(day, "EEE")}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View className="px-4">
            <View className="flex-row justify-between items-center mt-4">
              <Text style={styles.dateText}>
                {format(selectedDate, "d, LLLL yyyy")}
              </Text>
              <Pressable onPress={() => getCachedMealsForDate(selectedDate)}>
                <IconSymbol
                  name="arrow.2.circlepath"
                  color={Colors.brand.primary}
                  size={20}
                />
              </Pressable>
            </View>

            {planLoading ? (
              <View className="items-center justify-center py-10">
                <ActivityIndicator size="large" color={Colors.brand.primary} />
              </View>
            ) : (
              <>
                {getCachedMealsForDate(selectedDate).map((meal) => {
                  const isSelectedMealtime = selectedMealtime === meal.mealtime;

                  return (
                    <View key={meal.mealtime} style={styles.mealtimeContainer}>
                      <View className="flex-row justify-between items-center mb-3">
                        <Text style={styles.mealtimeTitle}>
                          {capitalize(meal.mealtime)}
                        </Text>
                        <Pressable
                          onPress={() =>
                            setFields({
                              showSettingModal: true,
                              selectedMealtime: meal.mealtime,
                            })
                          }
                        >
                          <IconSymbol
                            name="ellipsis"
                            color={Colors.brand.primary}
                            size={22}
                            selectedIcon={1}
                          />
                        </Pressable>
                      </View>

                      <View className="flex-row items-start flex-1">
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ gap: 12 }}
                        >
                          {meal.recipes.map((recipe) => (
                            <View
                              key={recipe.id}
                              className="flex-col justify-between gap-3"
                            >
                              <View className="flex-col gap-2 w-[130px]">
                                <TouchableOpacity
                                  testID={`recipe-card-${recipe.id}`}
                                  onPress={() =>
                                    router.push({
                                      pathname: Routes.PostDetail,
                                      params: { id: recipe.id },
                                    })
                                  }
                                >
                                  <Image
                                    source={{ uri: getImageUrl(recipe.image) }}
                                    style={styles.addMealButton}
                                    resizeMode="cover"
                                  />
                                </TouchableOpacity>
                                <Text style={styles.recipeTitle}>
                                  {recipe.name}
                                </Text>
                              </View>

                              {(showRegenerateButton || showDeleteButton) &&
                                isSelectedMealtime && (
                                  <Pressable
                                    onPress={() => {
                                      showDeleteButton
                                        ? deleteFromMealplan(
                                            meal.mealtime,
                                            recipe.id
                                          )
                                        : generateMeals(
                                            [meal.mealtime],
                                            recipe.id,
                                            true
                                          );
                                    }}
                                    style={styles.button}
                                  >
                                    <IconSymbol
                                      name={
                                        showDeleteButton
                                          ? "trash"
                                          : "arrow.clockwise.circle"
                                      }
                                      color={Colors.brand.onPrimary}
                                      size={22}
                                    />
                                  </Pressable>
                                )}
                            </View>
                          ))}

                          <TouchableOpacity
                            onPress={() => router.push(Routes.Search)}
                            style={styles.addMealButton}
                          >
                            <IconSymbol
                              name="plus"
                              color={Colors.overlay.base}
                              size={30}
                            />
                          </TouchableOpacity>
                        </ScrollView>
                      </View>
                    </View>
                  );
                })}

                <TouchableOpacity
                  onPress={() => setFieldState("showMealtimeModal", true)}
                  style={styles.addContianer}
                >
                  <Text style={styles.addText}>Add Mealtime</Text>
                  <IconSymbol
                    name="plus"
                    color={Colors.overlay.base}
                    size={20}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>

        <Pressable
          testID="planner-generate-button"
          disabled={generateLoading}
          onPress={() => {
            if (showRegenerateButton || showDeleteButton) {
              setFields({
                showDeleteButton: false,
                showRegenerateButton: false,
              });
              return;
            }

            const addedMeals = getCachedMealsForDate(selectedDate);
            if (addedMeals.length === 0) {
              Alert.alert(
                "No Mealtime Added",
                "Please add at least one mealtime before generating meals."
              );
              return;
            }

            const mealtimes = addedMeals.map((meal) => meal.mealtime);
            generateMeals(mealtimes);
          }}
          style={styles.generateButton}
        >
          {generateLoading ? (
            <LottieView
              testID="lottie-loading"
              source={require("@/assets/animations/insider-loading.json")}
              autoPlay
              loop
              style={{ width: 120, height: 120 }}
            />
          ) : showRegenerateButton || showDeleteButton ? (
            <Text style={[styles.generateText, { fontSize: 15 }]}>Cancel</Text>
          ) : (
            <>
              <IconSymbol
                name="plus"
                color={Colors.brand.onPrimary}
                size={22}
              />
              <Text style={styles.generateText}>Generate</Text>
            </>
          )}
        </Pressable>
      </View>
    </>
  );
}
