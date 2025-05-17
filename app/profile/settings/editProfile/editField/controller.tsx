import { account, databases } from "@/services/appwrite";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { setLoading } from "@/redux/slices/loadingSlice";
import { Alert } from "react-native";
import { router } from "expo-router";
import { useFieldState } from "@/hooks/useFieldState";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { useProfileData } from "@/hooks/useProfileData";
import { syncUserCache } from "@/utility/userCacheUtils";

interface EditFieldState {
  value: string;
  showDatePicker: boolean;
}

const fieldLabels: Record<string, string> = {
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

  const parsedValue = (() => {
    try {
      const parsed = JSON.parse(decodeURIComponent(initialData || "{}"));
      return parsed[key] || "";
    } catch {
      return "";
    }
  })();

  const edit = useFieldState<EditFieldState>({
    value: parsedValue,
    showDatePicker: false,
  });

  const { value, showDatePicker, setFieldState } = edit;
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
      await databases.updateDocument(
        AppwriteConfig.DATABASE_ID,
        AppwriteConfig.USERS_COLLECTION_ID,
        user.$id,
        { [key]: value }
      );

      await Promise.all([fetchProfile(), syncUserCache(user.$id)]);

      Alert.alert("Success", `${label} updated successfully.`);
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", `Failed to update ${label}. Please try again.`);
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
