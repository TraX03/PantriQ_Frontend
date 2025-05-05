import React from "react";
import EditProfileComponent from "./component";
import EditProfileController from "./controller";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useFieldState } from "@/hooks/useFieldState";

export default function EditProfileContainer() {
  const profileData = useSelector((state: RootState) => state.profile.userData);
  const loading = useSelector((state: RootState) => state.loading.loading);

  const profile = useFieldState({
    isBackgroundDark: false,
  });

  const { isBackgroundDark, onChangeBackgroundPress } = EditProfileController({
    profileData,
    profile,
  });

  return (
    <EditProfileComponent
      profileData={profileData}
      loading={loading}
      isBackgroundDark={isBackgroundDark}
      onChangeBackgroundPress={onChangeBackgroundPress}
    />
  );
}
