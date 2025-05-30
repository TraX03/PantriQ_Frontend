import { useAuthentication } from "@/hooks/useAuthentication";
import { fetchAndSaveMeals } from "@/scripts/fetch-store-meals";

export const useSettingsController = () => {
  const { logout } = useAuthentication();

  const handleLogout = () => {
    // router.replace(Routes.Onboarding);
    fetchAndSaveMeals();
  };

  return {
    handleLogout,
  };
};

export default useSettingsController;
