import ProfileComponent from "./component";
import SettingsController from "./controller";

export default function SettingsContainer() {
  const { handleLogout } = SettingsController();

  return (
    <ProfileComponent
      onLogout={handleLogout}
    />
  );
}
