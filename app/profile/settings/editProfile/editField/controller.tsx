import { account, databases } from "@/services/appwrite";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { setLoading } from "@/redux/slices/loadingSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useProfileData } from "@/hooks/useProfileData";
import { Alert } from "react-native";
import { router } from "expo-router";
import { useFieldState } from "@/hooks/useFieldState";

interface EditState {
  value: string;
  showDatePicker: boolean;
}

type Props = {
  key: string;
  label: string;
  edit: ReturnType<typeof useFieldState<EditState>>;
};

export default function EditFieldController({ key, label, edit }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { fetchProfile } = useProfileData();
  const { value, showDatePicker, setFieldState } = edit;

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

  const toggleDatePicker = (isVisible: boolean) => {
    setFieldState("showDatePicker", isVisible);
  };

  const setValue = (newValue: string) => {
    setFieldState("value", newValue);
  };

  return {
    value,
    setValue,
    handleSave,
    showDatePicker,
    toggleDatePicker,
  };
}
