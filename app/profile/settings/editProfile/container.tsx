import React from "react";
import EditProfileComponent from "./component";
import { useEditProfileController } from "./controller";

export default function EditProfileContainer() {
  const { profileData, loading, isBackgroundDark, onChangeImagePress } =
    useEditProfileController();

  return (
    <EditProfileComponent
      profileData={profileData}
      loading={loading}
      isBackgroundDark={isBackgroundDark}
      onChangeImagePress={onChangeImagePress}
    />
  );
}
