import useAuth from "@/app/authentication/context";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import reactotron from "reactotron-react-native";

export function useRequireLogin() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const requireLogin = (onAuthenticated: () => void) => {
    if (!isLoggedIn) {
      reactotron.log("User is not logged in");
      Alert.alert("Login Required", "Please sign in to continue.");
      router.push("/authentication/sign-in");
    } else {
      reactotron.log("User is logged in");
      onAuthenticated();
    }
  };

  return { requireLogin };
}
