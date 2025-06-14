import { useAuthentication } from "@/hooks/useAuthentication";

export const useSettingsController = () => {
  const { logout } = useAuthentication();

  const handleLogout = () => {
    // router.replace(Routes.Onboarding);
    logout();
  };

  return {
    handleLogout,
  };
};

export default useSettingsController;
