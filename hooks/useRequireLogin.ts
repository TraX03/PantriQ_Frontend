import { useAuth } from "@/features/authentication/context";
import { useRouter } from "expo-router";

export function useRequireLogin() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const checkLogin = (onAuthenticated: () => void) => {
    if (isLoggedIn) {
      onAuthenticated();
    } else {
      router.push("/authentication/sign-in");
    }
  };

  return { checkLogin };
}
