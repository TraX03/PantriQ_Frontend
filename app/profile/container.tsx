import ProfileComponent from "./component";
import { useProfileData } from "@/hooks/useProfileData";

export default function ProfileContainer() {
  const { profileData, loading } = useProfileData();
  return <ProfileComponent profileData={profileData} loading={loading} />;
}
