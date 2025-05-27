import { Routes } from "@/constants/Routes";
import { useAuthentication } from "@/hooks/useAuthentication";
import { router } from "expo-router";

export const useSettingsController = () => {
  const { logout } = useAuthentication();

  const handleLogout = () => {
    router.replace(Routes.Onboarding);
  };

  return {
    handleLogout,
  };
};

export default useSettingsController;
