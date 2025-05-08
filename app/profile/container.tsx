import ProfileComponent from "./component";
import { useProfileData } from "@/hooks/useProfileData";
import { RootState } from "@/redux/store";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import { useFieldState } from "@/hooks/useFieldState";
import ProfileController from "./controller";
import { useFocusEffect } from "expo-router";

export default function ProfileContainer() {
  const { fetchProfile } = useProfileData();
  const { checkLogin } = useRequireLogin();
  const profileData = useSelector((state: RootState) => state.profile.userData);
  const loading = useSelector((state: RootState) => state.loading.loading);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const profile = useFieldState({
    activeTab: "Posts",
    posts: [],
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (profileData) {
        ProfileController.fetchPostsByUser(profileData, profile);
      }
    }, [profileData])
  );

  return (
    <ProfileComponent
      profileData={profileData}
      loading={loading}
      checkLogin={checkLogin}
      isLoggedIn={isLoggedIn}
      profile={profile}
    />
  );
}
