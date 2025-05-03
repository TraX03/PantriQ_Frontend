import ProfileComponent from "./component";
import { useProfileData } from "@/hooks/useProfileData";
import { useEffect } from "react";

export default function ProfileContainer() {
  const { fetchProfile } = useProfileData();

  useEffect(() => {
    fetchProfile();
  }, []);

  return <ProfileComponent />;
}
