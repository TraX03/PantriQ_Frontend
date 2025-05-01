import { useFocusEffect } from "expo-router";
import EditProfileComponent from "./component";
import { useProfileData } from "@/hooks/useProfileData";
import { useCallback } from "react";

export default function EditProfileContainer() {
  const { profileData, fetchProfile } = useProfileData();

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  return <EditProfileComponent profileData={profileData} />;
}
