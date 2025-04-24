import { router } from "expo-router";
import useAuth from "@/app/authentication/context";
import reactotron from "reactotron-react-native";

export default function AuthFormController(mode: "sign-in" | "sign-up") {
  const { login } = useAuth();

  const handleSubmit = async (email: string, password: string) => {
    try {
      await login(email, password);

      // Redirect based on mode
      if (mode === "sign-up") {
        router.replace("/");
      } else {
        router.replace("/");
      }

      reactotron.log("Authentication successful.");
    } catch (error) {
      reactotron.log("Authentication failed: " + error);
      throw error;
    }
  };

  return { handleSubmit };
}
