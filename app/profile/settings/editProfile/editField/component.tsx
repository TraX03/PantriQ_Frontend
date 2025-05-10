import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors } from "@/constants/Colors";
import { styles } from "@/utility/profile/styles";
import HeaderBar from "@/components/HeaderBar";
import InputBox from "@/components/InputBox";

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
  const renderFieldInput = () => {
    switch (keyName) {
      case "gender":
        return (
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
        );

      case "birthday":
        return (
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
        );

      default:
        return (
          <View className="mt-4">
            <InputBox
              placeholder={`Enter your ${label.toLowerCase()}`}
              value={value}
              onChangeText={setValue}
              inputStyle={styles.input}
              lines={4}
              limit={maxLength}
              isMultiline
            />
          </View>
        );
    }
  };

  return (
    <KeyboardAvoidingView style={styles.headerContainer}>
      <HeaderBar title={`Edit ${label}`} />
      <View className="flex-1 px-4">
        {renderFieldInput()}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
