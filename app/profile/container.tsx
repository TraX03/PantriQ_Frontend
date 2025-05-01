import reactotron from "reactotron-react-native";
import ProfileComponent from "./component";
import { useProfileData } from "@/hooks/useProfileData";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function ProfileContainer() {
  const { profileData, fetchProfile } = useProfileData();

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  return <ProfileComponent profileData={profileData} />;
}
