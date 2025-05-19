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

export interface EditFieldState {
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

  const label = fieldLabels[key] || "Unknown Field";

  const handleSave = async () => {
    if (!key) return;
    dispatch(setLoading(true));

    try {
      const user = await account.get();
      await databases.updateDocument(
        AppwriteConfig.DATABASE_ID,
        AppwriteConfig.USERS_COLLECTION_ID,
        user.$id,
        { [key]: edit.value }
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
    edit,
    keyName: key,
    label,
    handleSave,
    maxLength,
  };
};

export default useEditFieldController;
