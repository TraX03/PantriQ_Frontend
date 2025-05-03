import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { router, Stack, useLocalSearchParams } from "expo-router";
//prettier-ignore
import { View, TextInput, Text, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState, useMemo } from "react";
import { account, databases } from "@/services/appwrite";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { setLoading } from "@/redux/slices/loadingSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useProfileData } from "@/hooks/useProfileData";
import reactotron from "reactotron-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const fieldLabels: Record<string, string> = {
  username: "Username",
  bio: "Bio",
  gender: "Gender",
  birthday: "Birthday",
  phone: "Phone Number",
  email: "Email",
};

export default function EditFieldScreen() {
  const { key, size, data } = useLocalSearchParams<{
    key: string;
    size: string;
    data: string;
  }>();
  const dispatch = useDispatch<AppDispatch>();
  const { fetchProfile } = useProfileData();
  const genderOptions = ["Female", "Male", "Prefer not to say", "Other"];

  const profile = useMemo(() => {
    try {
      return JSON.parse(decodeURIComponent(data || "{}")) as Record<
        string,
        string
      >;
    } catch {
      return {};
    }
  }, [data]);

  const label = fieldLabels[key] || "Unknown Field";
  const initialValue = profile[key] || "";

  const [value, setValue] = useState(initialValue);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    if (!key) return;
    dispatch(setLoading(true));
    try {
      const user = await account.get();
      const userId = user.$id;

      await databases.updateDocument(
        AppwriteConfig.DATABASE_ID,
        AppwriteConfig.USERS_COLLECTION_ID,
        userId,
        { [key]: value }
      );
      fetchProfile();
      Alert.alert("Success", `${label} updated successfully.`);
      router.back();
    } catch (err) {
      Alert.alert("Error", "Failed to update. Please try again.");
      console.error(err);
    } finally {
      dispatch(setLoading(false));
    }
  };
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ backgroundColor: Colors.brand.secondary, paddingTop: 65 }}
      >
        <View className="flex-row items-center px-4 py-3">
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol
              name="chevron.left"
              color={Colors.brand.primaryDark}
              size={30}
            />
          </TouchableOpacity>
          <Text className="text-xl ml-4" style={{ fontFamily: "RobotoMedium" }}>
            Edit {label}
          </Text>
        </View>
        <View className="flex-1 px-4">
          {key === "gender" ? (
            <View className="mt-4 space-y-3">
              {genderOptions.map((option) => {
                const isSelected = value === option;

                return (
                  <TouchableOpacity
                    key={option}
                    className="flex-row justify-between items-center px-2 py-2 rounded-lg"
                    style={{
                      borderColor: isSelected ? Colors.brand.primary : "#ccc",
                      backgroundColor: isSelected
                        ? Colors.brand.secondary
                        : "#fff",
                    }}
                    onPress={() => setValue(option)}
                  >
                    <Text
                      style={{
                        fontFamily: "RobotoRegular",
                        color: Colors.ui.base,
                        textTransform: "capitalize",
                        fontSize: 14,
                      }}
                    >
                      {option}
                    </Text>
                    <View
                      className="w-5 h-5 rounded-full border items-center justify-center"
                      style={{
                        borderColor: isSelected ? Colors.brand.primary : "#ccc",
                      }}
                    >
                      {isSelected && (
                        <View
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: Colors.brand.primary }}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : key === "birthday" ? (
            <>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="border border-gray-300 rounded-lg px-4 py-2 mt-4"
              >
                <Text
                  className="text-base"
                  style={{ fontFamily: "RobotoRegular", color: Colors.ui.base }}
                >
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
                    setShowDatePicker(false);
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
                  multiline={true}
                  numberOfLines={4}
                  maxLength={size ? Number(size) : undefined}
                  onChangeText={setValue}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-base pr-14"
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
              {size && (
                <Text className="text-right mt-2 text-sm text-gray-500">
                  {value.length}/{size} characters
                </Text>
              )}
            </>
          )}

          <TouchableOpacity
            className="mt-7 py-3 rounded-xl w-28 self-end"
            style={{ backgroundColor: Colors.brand.primary }}
            onPress={handleSave}
          >
            <Text
              className="text-center text-white text-base"
              style={{ fontFamily: "RobotoMedium" }}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
