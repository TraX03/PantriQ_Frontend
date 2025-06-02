import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import ProfileContainer from "../profile/container";

export default function ProfileScreenRoute() {
  const userId = useSelector((state: RootState) => state.auth.user?.$id);
  return <ProfileContainer profileId={userId} />;
}
