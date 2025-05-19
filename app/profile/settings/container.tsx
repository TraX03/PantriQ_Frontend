import { useProfileData } from "@/hooks/useProfileData";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import ProfileComponent from "./component";
import SettingsController from "./controller";

export default function SettingsContainer() {
  const { fetchProfile } = useProfileData();
  const { handleLogout } = SettingsController();

  const profileData = useSelector((state: RootState) => state.profile.userData);

  useEffect(() => {
    fetchProfile();
  }, []);

  return <ProfileComponent profileData={profileData} onLogout={handleLogout} />;
}
