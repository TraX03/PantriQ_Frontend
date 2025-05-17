import { useProfileData } from "@/hooks/useProfileData";
import ProfileComponent from "./component";
import SettingsController from "./controller";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function SettingsContainer() {
  const { fetchProfile } = useProfileData();
  const { handleLogout } = SettingsController();

  const profileData = useSelector((state: RootState) => state.profile.userData);

  useEffect(() => {
    fetchProfile();
  }, []);

  return <ProfileComponent profileData={profileData} onLogout={handleLogout} />;
}
