import { router } from "expo-router";
import { useAuth } from "../../../features/authentication/context";
import reactotron from "reactotron-react-native";
import { AuthFormActions } from "../../../features/authentication/actions";

type ControllerProps = {
  mode: "sign-in" | "sign-up";
  form: ReturnType<typeof AuthFormActions>;
};

export default function AuthFormController({ mode, form }: ControllerProps) {
  const { login, signUp } = useAuth();

  const validate = () => {
    let isValid = true;

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      form.setFieldState("emailError", "* Please enter a valid email.");
      isValid = false;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

    if (!passwordRegex.test(form.password)) {
      form.setFieldState(
        "passwordError",
        "* Password must be at least 8 characters, with one uppercase and one special character."
      );
      form.setFieldState("showPasswordModal", true);
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      if (mode === "sign-up") {
        await signUp(form.email, form.password, form.email.split("@")[0]);
        router.replace("/onboarding/component");
      } else {
        await login(form.email, form.password);
        router.replace("/");
      }
    } catch (error) {
      reactotron.log("Authentication failed:", error);
    }
  };

  return {
    handleSubmit,
  };
}
