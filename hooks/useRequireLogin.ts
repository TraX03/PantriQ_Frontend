import { useAuth } from "@/features/authentication/context";
import { useRouter } from "expo-router";
import reactotron from "reactotron-react-native";

export function useRequireLogin() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const requireLogin = (onAuthenticated: () => void) => {
    if (!isLoggedIn) {
      reactotron.log("User is not logged in");
      router.push("/authentication/sign-in");
    } else {
      reactotron.log("User is logged in");
      onAuthenticated();
    }
  };

  return { requireLogin };
}
