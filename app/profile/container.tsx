import ProfileComponent from "./component";
import { useProfileData } from "@/hooks/useProfileData";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import ProfileController from "./controller";

export default function ProfileContainer() {
  const { fetchProfile } = useProfileData();
  const profileData = useSelector((state: RootState) => state.profile.userData);
  const loading = useSelector((state: RootState) => state.loading.loading);
  const { handleLogout } = ProfileController();

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ProfileComponent
      profileData={profileData}
      loading={loading}
      onLogout={handleLogout}
    />
  );
}
