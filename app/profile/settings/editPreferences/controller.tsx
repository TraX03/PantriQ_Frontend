import { AppwriteConfig } from "@/constants/AppwriteConfig";
import {
  getCurrentUser,
  getDocumentById,
  updateDocument,
} from "@/services/Appwrite";
import { useState } from "react";

export const useEditPreferencesController = () => {
  const [regionPreferences, setRegionPreferences] = useState<string[] | null>(
    null
  );

  const fetchRegionPreferences = async () => {
    try {
      const currentUser = await getCurrentUser();
      const document = await getDocumentById(
        AppwriteConfig.USERS_COLLECTION_ID,
        currentUser.$id
      );

      const region_pref = document.region_pref as string[] | undefined;

      setRegionPreferences(region_pref ?? []);
    } catch (err: any) {
      console.error("Failed to fetch region preferences:", err);
    }
  };

  const handleSave = async (newPreferences: string[]) => {
    try {
      const currentUser = await getCurrentUser();

      await updateDocument(
        AppwriteConfig.USERS_COLLECTION_ID,
        currentUser.$id,
        {
          region_pref: newPreferences.map((pref) => pref.toLowerCase()),
        }
      );

      setRegionPreferences(newPreferences);
    } catch (err: any) {
      console.error("Failed to save region preferences:", err);
    }
  };

  return {
    regionPreferences,
    refetch: fetchRegionPreferences,
    handleSave,
  };
};

export default useEditPreferencesController;
