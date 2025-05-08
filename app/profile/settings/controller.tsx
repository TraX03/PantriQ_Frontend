import { useAuthentication } from "@/hooks/useAuthentication";

export default function SettingsController() {
  const { logout } = useAuthentication();

  const handleLogout = () => {
    logout();
  };

  return {
    handleLogout,
  };
}
