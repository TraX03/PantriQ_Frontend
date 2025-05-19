import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useFieldState } from "@/hooks/useFieldState";
import { styles as homeStyles } from "@/utility/home/styles";
import { styles } from "@/utility/planner/styles";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDays, endOfWeek, format, isThisWeek, startOfDay } from "date-fns";
import React, { useRef } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PlannerState } from "./controller";

type DateInfo = {
  minDate: Date;
  maxDate: Date;
  weekStart: Date;
};

type Props = {
  planner: ReturnType<typeof useFieldState<PlannerState>>;
  generateMeals: () => void;
  date: DateInfo;
  handleChangeWeek: (direction: "prev" | "next") => void;
};

export default function PlannerComponent({
  planner,
  generateMeals,
  date,
  handleChangeWeek,
}: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const { selectedDate, showDatePicker, setFieldState } = planner;
  const { weekStart, minDate, maxDate } = date;

  const formattedWeek = isThisWeek(selectedDate, { weekStartsOn: 1 })
    ? "This Week"
    : `${format(weekStart, "MMM d")} — ${format(
        endOfWeek(selectedDate, { weekStartsOn: 1 }),
        "MMM d"
      )}`;

  return (
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
                color={Colors.brand.main}
              />
            </Pressable>
            <Pressable>
              <IconSymbol name="ellipsis.circle" color={Colors.brand.main} />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.weekContainer}>
        <Pressable onPress={() => handleChangeWeek("prev")}>
          <IconSymbol name="chevron.left" color={Colors.brand.main} />
        </Pressable>

        <TouchableOpacity onPress={() => setFieldState("showDatePicker", true)}>
          <Text style={styles.weekText}>{formattedWeek}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            minimumDate={minDate}
            maximumDate={maxDate}
            onChange={(event, date) => {
              setFieldState("showDatePicker", false);
              if (date) setFieldState("selectedDate", startOfDay(date));
            }}
          />
        )}

        <Pressable onPress={() => handleChangeWeek("next")}>
          <IconSymbol name="chevron.right" color={Colors.brand.main} />
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
              const isWithinAllowedRange = day >= minDate && day <= maxDate;

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    if (!isWithinAllowedRange) {
                      alert(
                        "Meal plan only retains the previous and next 30 days."
                      );
                    } else {
                      setFieldState("selectedDate", startOfDay(day));
                    }
                  }}
                  className="px-4 py-1.5 mr-2.5 rounded-lg"
                  style={{
                    backgroundColor: isSelected
                      ? Colors.brand.main
                      : Colors.text.placeholder,
                    opacity: isWithinAllowedRange ? 1 : 0.4,
                  }}
                >
                  <Text
                    style={[
                      styles.dayText,
                      {
                        color: isSelected
                          ? Colors.brand.accent
                          : Colors.ui.base,
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
            <Pressable
              onPress={() => setFieldState("selectedDate", new Date())}
            >
              <IconSymbol
                name="arrow.2.circlepath"
                color={Colors.brand.main}
                size={22}
              />
            </Pressable>
          </View>

          {planner.meals.map((meal, index) => (
            <View key={index} style={styles.mealtimeContainer}>
              <View className="flex-row justify-between items-center mb-3">
                <Text style={styles.mealtimeTitle}>{meal.mealtime}</Text>
                <IconSymbol
                  name="ellipsis"
                  color={Colors.brand.main}
                  size={22}
                />
              </View>

              <View className="flex-row items-start gap-3 flex-1">
                {meal.recipe && (
                  <View className="flex-col gap-2 w-[130px]">
                    <Image
                      source={{ uri: meal.recipe.image }}
                      style={styles.addMealButton}
                      resizeMode="cover"
                    />
                    <Text style={styles.recipeTitle}>{meal.recipe.name}</Text>
                  </View>
                )}

                <TouchableOpacity
                  onPress={() => {}}
                  style={styles.addMealButton}
                >
                  <IconSymbol name="plus" color={Colors.ui.overlay} size={30} />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <View style={styles.addContianer}>
            <Text style={styles.addText}>Add Mealtime</Text>
            <IconSymbol name="plus" color={Colors.ui.overlay} size={20} />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity onPress={generateMeals}>
        <View style={styles.generateButton}>
          <Text style={styles.generateText}>Generate Meal</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
