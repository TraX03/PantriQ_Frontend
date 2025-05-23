import { useProfileData } from "@/hooks/useProfileData";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import { setRefreshProfile } from "@/redux/slices/profileSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileComponent from "./component";
import { useProfileController } from "./controller";

export default function ProfileContainer() {
  const { checkLogin } = useRequireLogin();
  const { fetchProfile } = useProfileData();
  const dispatch = useDispatch<AppDispatch>();

  const { userData: profileData, refreshProfile } = useSelector(
    (state: RootState) => state.profile
  );
  const isLoading = useSelector((state: RootState) => state.loading.loading);
  const isLoggedIn = useSelector((state: RootState) => !!state.auth.user);

  const { profile, fetchPostsByUser } = useProfileController();

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profileData && profile.posts.length === 0) {
      fetchPostsByUser(profileData);
    }
  }, [profileData]);

  useEffect(() => {
    if (refreshProfile && profileData) {
      fetchPostsByUser(profileData);
      dispatch(setRefreshProfile(false));
    }
  }, [refreshProfile]);

  return (
    <ProfileComponent
      profileData={profileData}
      isLoading={isLoading}
      isLoggedIn={isLoggedIn}
      checkLogin={checkLogin}
      profile={profile}
    />
  );
}
