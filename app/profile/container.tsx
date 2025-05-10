import ProfileComponent from "./component";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import { useProfileController } from "./controller";

export default function ProfileContainer() {
  const { checkLogin } = useRequireLogin();
  const { profileData, isLoading, isLoggedIn, profile } = useProfileController();

  return (
    <ProfileComponent
      profileData={profileData}
      loading={isLoading}
      isLoggedIn={isLoggedIn}
      checkLogin={checkLogin}
      profile={profile}
    />
  );
}