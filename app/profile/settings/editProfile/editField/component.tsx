import React from "react";
//prettier-ignore
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { styles } from "@/utility/profile/styles";

type Props = {
  keyName: string;
  label: string;
  value: string;
  setValue: (val: string) => void;
  handleSave: () => void;
  showDatePicker: boolean;
  toggleDatePicker: (val: boolean) => void;
  maxLength?: number;
};

const genderOptions = ["Female", "Male", "Prefer not to say", "Other"];

export default function EditFieldComponent({
  keyName,
  label,
  value,
  setValue,
  handleSave,
  showDatePicker,
  toggleDatePicker,
  maxLength,
}: Props) {
  return (
    <>
      <KeyboardAvoidingView style={styles.headerContainer}>
        <View className="flex-row items-center px-4 py-3">
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol
              name="chevron.left"
              color={Colors.brand.dark}
              size={30}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit {label}</Text>
        </View>

        <View className="flex-1 px-4">
          {keyName === "gender" ? (
            <View className="mt-4 space-y-3">
              {genderOptions.map((option) => {
                const isSelected = value === option;
                return (
                  <TouchableOpacity
                    key={option}
                    className="flex-row justify-between items-center px-2 py-2 rounded-lg"
                    onPress={() => setValue(option)}
                  >
                    <Text style={styles.genderOptionText}>{option}</Text>
                    <View
                      className="w-5 h-5 rounded-full border items-center justify-center"
                      style={{
                        borderColor: isSelected
                          ? Colors.brand.main
                          : Colors.text.placeholder,
                      }}
                    >
                      {isSelected && <View style={styles.radioButtom} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : keyName === "birthday" ? (
            <>
              <TouchableOpacity
                onPress={() => toggleDatePicker(true)}
                style={styles.inputBox}
              >
                <Text style={styles.inputPlaceholder}>
                  {value
                    ? new Date(value).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Select your birthday"}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={value ? new Date(value) : new Date()}
                  mode="date"
                  display="default"
                  maximumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    toggleDatePicker(false);
                    if (selectedDate) {
                      setValue(selectedDate.toISOString());
                    }
                  }}
                />
              )}
            </>
          ) : (
            <>
              <View className="relative mt-4">
                <TextInput
                  placeholder={`Enter your ${label.toLowerCase()}`}
                  value={value}
                  multiline
                  numberOfLines={4}
                  maxLength={maxLength}
                  onChangeText={setValue}
                  style={styles.input}
                />
                {value.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setValue("")}
                    className="absolute right-5 top-1/2 transform -translate-y-1/2 self-center"
                  >
                    <IconSymbol
                      name="multiply.circle"
                      color={Colors.ui.overlay}
                      size={17}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {maxLength && (
                <Text style={styles.indicatorText}>
                  {value.length}/{maxLength} characters
                </Text>
              )}
            </>
          )}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
