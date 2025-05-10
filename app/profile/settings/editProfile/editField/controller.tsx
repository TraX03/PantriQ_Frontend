import { account, databases } from "@/services/appwrite";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { setLoading } from "@/redux/slices/loadingSlice";
import { Alert } from "react-native";
import { router } from "expo-router";
import { useFieldState } from "@/hooks/useFieldState";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { useProfileData } from "@/hooks/useProfileData";
import { useState, useEffect } from "react";

export interface EditFieldState {
  value: string;
  showDatePicker: boolean;
}

export const fieldLabels: Record<string, string> = {
  username: "Username",
  bio: "Bio",
  gender: "Gender",
  birthday: "Birthday",
  phone: "Phone Number",
  email: "Email",
};

export const useEditFieldController = (
  key: string,
  initialData: string,
  maxLength?: number
) => {
  const dispatch = useDispatch<AppDispatch>();
  const { fetchProfile } = useProfileData();

  const [initialValue, setInitialValue] = useState("");

  useEffect(() => {
    try {
      const parsedData = JSON.parse(decodeURIComponent(initialData || "{}"));
      setInitialValue(parsedData[key] || "");
    } catch {
      setInitialValue("");
    }
  }, [initialData, key]);

  const editState = useFieldState<EditFieldState>({
    value: initialValue,
    showDatePicker: false,
  });

  useEffect(() => {
    if (initialValue) {
      editState.setFieldState("value", initialValue);
    }
  }, [initialValue]);

  const { value, showDatePicker } = editState;
  const { setFieldState } = editState;

  const label = fieldLabels[key] || "Unknown Field";

  const setValue = (newValue: string) => {
    setFieldState("value", newValue);
  };

  const toggleDatePicker = (isVisible: boolean) => {
    setFieldState("showDatePicker", isVisible);
  };

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

      await fetchProfile();
      Alert.alert("Success", `${label} updated successfully.`);
      router.back();
    } catch (err) {
      Alert.alert("Error", "Failed to update. Please try again.");
      console.error(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    keyName: key,
    label,
    value,
    setValue,
    handleSave,
    showDatePicker,
    toggleDatePicker,
    maxLength,
  };
};

export default useEditFieldController;
