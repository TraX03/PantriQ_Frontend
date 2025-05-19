import { useProfileData } from "@/hooks/useProfileData";
import { RootState } from "@/redux/store";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import EditProfileComponent from "./component";
import { useEditProfileController } from "./controller";

export default function EditProfileContainer() {
  const { fetchProfile } = useProfileData();

  const profileData = useSelector((state: RootState) => state.profile.userData);
  const loading = useSelector((state: RootState) => state.loading.loading);

  const { onChangeImagePress, isBackgroundDark } =
    useEditProfileController(profileData);

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <EditProfileComponent
      isBackgroundDark={isBackgroundDark}
      profileData={profileData}
      loading={loading}
      onChangeImagePress={onChangeImagePress}
    />
  );
}
