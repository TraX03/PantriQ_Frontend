import { useAuthentication } from "@/hooks/useAuthentication";

export default function ProfileController() {
  const { logout } = useAuthentication();

  const handleLogout = () => {
    logout();
  };

  return {
    handleLogout,
  };
}
