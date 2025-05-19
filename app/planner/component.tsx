import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { styles as homeStyles } from "@/utility/home/styles";
import { styles } from "@/utility/planner/styles";
import {
  Pressable,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  startOfWeek,
  endOfWeek,
  format,
  isThisWeek,
  subDays,
  addDays,
} from "date-fns";
import React from "react";
import { useFieldState } from "@/hooks/useFieldState";
import { PlannerState } from "./controller";
import DateTimePicker from "@react-native-community/datetimepicker";

type Props = {
  planner: ReturnType<typeof useFieldState<PlannerState>>;
};

export default function PlannerComponent({ planner }: Props) {
  const { selectedDate, showDatePicker, setFieldState } = planner;

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
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
              onPress={() => setFieldState("selectedDate", new Date())}
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
      <View style={styles.dateContainer}>
        <Pressable
          onPress={() => {
            setFieldState("selectedDate", subDays(selectedDate, 7));
          }}
        >
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
            onChange={(event, date) => {
              setFieldState("showDatePicker", false);
              if (date) setFieldState("selectedDate", date);
            }}
          />
        )}
        <Pressable
          onPress={() => {
            setFieldState("selectedDate", addDays(selectedDate, 7));
          }}
        >
          <IconSymbol name="chevron.right" color={Colors.brand.main} />
        </Pressable>
      </View>
      <View className="mt-2 py-1.5">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {Array.from({ length: 7 }).map((_, index) => {
            const day = addDays(weekStart, index);
            const isSelected =
              format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");

            return (
              <TouchableOpacity
                key={index}
                onPress={() => setFieldState("selectedDate", day)}
                className="px-4 py-1.5 mr-2.5 rounded-lg"
                style={{
                  backgroundColor: isSelected
                    ? Colors.brand.main
                    : Colors.text.placeholder,
                }}
              >
                <Text
                  style={[
                    styles.dayText,
                    {
                      color: isSelected ? Colors.brand.accent : Colors.ui.base,
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
      <View className="flex-row justify-between items-center px-4 mt-4">
        <Text style={styles.dateText}>
          {format(selectedDate, "d, LLLL yyyy")}
        </Text>
        <Pressable onPress={() => setFieldState("selectedDate", new Date())}>
          <IconSymbol
            name="arrow.2.circlepath"
            color={Colors.brand.main}
            size={22}
          />
        </Pressable>
      </View>
    </View>
  );
}
