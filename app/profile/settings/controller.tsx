import { useAuthentication } from "@/hooks/useAuthentication";

export const useSettingsController = () => {
  const { logout } = useAuthentication();

  const handleLogout = () => {
    logout();
  };

  return {
    handleLogout,
  };
};

export default useSettingsController;
