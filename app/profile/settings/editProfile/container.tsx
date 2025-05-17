import React, { useEffect } from "react";
import EditProfileComponent from "./component";
import { useEditProfileController } from "./controller";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useProfileData } from "@/hooks/useProfileData";
import { detectBackgroundDarkness } from "@/utility/imageColorUtils";
import { setLoading } from "@/redux/slices/loadingSlice";

export default function EditProfileContainer() {
  const { fetchProfile } = useProfileData();
  const dispatch = useDispatch<AppDispatch>();

  const profileData = useSelector((state: RootState) => state.profile.userData);
  const loading = useSelector((state: RootState) => state.loading.loading);

  const { profile, onChangeImagePress } = useEditProfileController();

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profileData?.profileBg) {
      detectBackgroundDarkness(profileData.profileBg).then((isDark) =>
        profile.setFieldState("isBackgroundDark", isDark)
      );
    }
  }, [profileData?.profileBg]);

  return (
    <EditProfileComponent
      profileData={profileData}
      loading={loading}
      isBackgroundDark={profile.isBackgroundDark}
      onChangeImagePress={onChangeImagePress}
    />
  );
}
