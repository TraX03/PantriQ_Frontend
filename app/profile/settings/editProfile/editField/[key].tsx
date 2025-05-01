import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useMemo } from "react";
import { useLoading } from "@/context/LoadingContext";
import { account, databases } from "@/services/appwrite";
import { AppwriteConfig } from "@/constants/AppwriteConfig";

const fieldLabels: Record<string, string> = {
  username: "Username",
  bio: "Bio",
  gender: "Gender",
  birthday: "Birthday",
  phone: "Phone Number",
  email: "Email",
};

export default function EditFieldScreen() {
  const { key, data } = useLocalSearchParams<{ key: string; data: string }>();
  const { setLoading } = useLoading();

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

  const handleSave = async () => {
    if (!key) return;
    setLoading(true);
    try {
      // Fetch current user ID
      const user = await account.get();
      const userId = user.$id;

      // Update the specific field in Appwrite
      await databases.updateDocument(
        AppwriteConfig.DATABASE_ID,
        AppwriteConfig.USERS_COLLECTION_ID,
        userId,
        { [key]: value }
      );

      Alert.alert("Success", `${label} updated successfully.`);
      router.back();
    } catch (err) {
      Alert.alert("Error", "Failed to update. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
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
          <TextInput
            placeholder={`Enter your ${label.toLowerCase()}`}
            value={value}
            onChangeText={setValue}
            className="border border-gray-300 rounded-lg px-4 py-2 text-base mt-4"
          />
          <TouchableOpacity
            className="mt-6 py-3 rounded-xl"
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
