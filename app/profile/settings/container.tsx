import ProfileComponent from "./component";
import SettingsController from "./controller";

export default function SettingsContainer() {
  const { profileData, handleLogout } = SettingsController();

  return <ProfileComponent profileData={profileData} onLogout={handleLogout} />;
}
