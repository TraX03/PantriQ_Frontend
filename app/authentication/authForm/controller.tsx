import { router } from "expo-router";
import { useAuth } from "../../../features/authentication/context";
import { AuthFormActions } from "../../../features/authentication/actions";
import { ValidationErrors, AuthErrors } from "@/constants/Errors";

type Props = {
  mode: "sign-in" | "sign-up";
  form: ReturnType<typeof AuthFormActions>;
};

export default function AuthFormController({ mode, form }: Props) {
  const { login, signUp } = useAuth();

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const isValidPassword = (password: string) =>
    /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
      password
    );

  const extractUsername = (email: string) => email.split("@")[0];

  const handleSubmit = async () => {
    if (mode === "sign-up" && !validateForm()) return;

    try {
      if (mode === "sign-up") {
        await signUp(form.email, form.password, extractUsername(form.email));
        router.replace("/onboarding/component");
      } else {
        await login(form.email, form.password);
        router.replace("/");
      }
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const validateForm = () => {
    if (!isValidEmail(form.email)) {
      showError(ValidationErrors.email);
      return false;
    }

    if (!isValidPassword(form.password)) {
      showError(ValidationErrors.password);
      return false;
    }

    return true;
  };

  const handleAuthError = (error: any) => {
    const { type, response } = error ?? {};
    const parsedMessage = response ? JSON.parse(response).message : "";

    switch (type) {
      case "general_argument_invalid":
        showError(getErrorFromMessage(parsedMessage));
        break;
      case "user_invalid_credentials":
        showError(AuthErrors.invalidCredentials);
        break;
      case "user_already_exists":
        showError(AuthErrors.emailAlreadyExists);
        break;
      default:
        showError(AuthErrors.unknown);
    }
  };

  const getErrorFromMessage = (message: string) => {
    if (message.includes("email")) return AuthErrors.invalidEmail;
    if (message.includes("password")) return AuthErrors.invalidPassword;
    return AuthErrors.unknown;
  };

  const showError = (errorConfig: {
    title: string;
    defaultMessage: string;
  }) => {
    form.setFieldState("errorTitle", errorConfig.title);
    form.setFieldState("errorMessage", errorConfig.defaultMessage);
    form.setFieldState("showErrorModal", true);
  };

  return {
    handleSubmit,
  };
}
