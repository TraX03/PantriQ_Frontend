import React, { useEffect } from "react";
import EditProfileComponent from "./component";
import EditProfileController from "./controller";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useFieldState } from "@/hooks/useFieldState";
import { useProfileData } from "@/hooks/useProfileData";

export default function EditProfileContainer() {
  const dispatch = useDispatch<AppDispatch>();
  const { fetchProfile } = useProfileData();

  const profileData = useSelector((state: RootState) => state.profile.userData);
  const loading = useSelector((state: RootState) => state.loading.loading);

  const profile = useFieldState({
    isBackgroundDark: false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profileData?.profileBg) {
      EditProfileController.detectBackgroundDarkness(
        profileData.profileBg,
        dispatch,
        profile
      );
    }
  }, [profileData?.profileBg]);

  const { isBackgroundDark, onChangeImagePress } = EditProfileController.init(
    profile,
    dispatch,
    fetchProfile
  );

  return (
    <EditProfileComponent
      profileData={profileData}
      loading={loading}
      isBackgroundDark={isBackgroundDark}
      onChangeImagePress={onChangeImagePress}
    />
  );
}
