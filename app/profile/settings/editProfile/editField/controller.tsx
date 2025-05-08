import { account, databases } from "@/services/appwrite";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { setLoading } from "@/redux/slices/loadingSlice";
import { Alert } from "react-native";
import { router } from "expo-router";

const EditFieldController = {
  async handleSave(
    key: string,
    value: string,
    label: string,
    dispatch: any,
    fetchProfile: () => Promise<void>
  ) {
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
  },

  toggleDatePicker(
    setFieldState: (key: keyof any, value: any) => void,
    isVisible: boolean
  ) {
    setFieldState("showDatePicker", isVisible);
  },

  setValue(
    setFieldState: (key: keyof any, value: any) => void,
    newValue: string
  ) {
    setFieldState("value", newValue);
  },
};

export default EditFieldController;
