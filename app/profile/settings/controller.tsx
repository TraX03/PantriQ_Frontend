import { useAuthentication } from "@/hooks/useAuthentication";
import { useProfileData } from "@/hooks/useProfileData";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useSettingsController = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { fetchProfile } = useProfileData();
  const { logout } = useAuthentication();

  const profileData = useSelector((state: RootState) => state.profile.userData);

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
  };

  return {
    profileData,
    handleLogout,
  };
};

export default useSettingsController;
