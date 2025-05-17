import ProfileComponent from "./component";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import { useProfileController } from "./controller";
import { useProfileData } from "@/hooks/useProfileData";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setRefreshProfile } from "@/redux/slices/profileSlice";

export default function ProfileContainer() {
  const { checkLogin } = useRequireLogin();
  const { fetchProfile } = useProfileData();
  const dispatch = useDispatch<AppDispatch>();

  const { userData: profileData, refreshProfile } = useSelector(
    (state: RootState) => state.profile
  );
  const isLoading = useSelector((state: RootState) => state.loading.loading);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

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
