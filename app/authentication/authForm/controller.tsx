import { useLocalSearchParams, useRouter } from "expo-router";
import { ValidationErrors, AuthErrors } from "@/constants/Errors";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useFieldState } from "@/hooks/useFieldState";
import { AuthFormState } from "./component";
import { Props as AuthFormProps } from "./container";

type Props = AuthFormProps & {
  form: ReturnType<typeof useFieldState<AuthFormState>>;
};

const AuthFormController = ({ mode, form }: Props) => {
  const { login, signUp } = useAuthentication();
  const router = useRouter();
  const { redirect } = useLocalSearchParams();
  const { email, password, setFieldState } = form;

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
        await signUp(email, password, extractUsername(email));
        // router.replace("/onboarding/component");
        router.replace("/");
      } else {
        await login(email, password);
        const redirectTo = typeof redirect === "string" ? redirect : "/";
        router.replace(redirectTo as never);
      }
    } catch (error: any) {
      await handleAuthError(error);
    }
  };

  const validateForm = () => {
    if (!isValidEmail(email)) {
      showError(ValidationErrors.email);
      return false;
    }

    if (!isValidPassword(password)) {
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
    setFieldState("errorTitle", errorConfig.title);
    setFieldState("errorMessage", errorConfig.defaultMessage);
    setFieldState("showErrorModal", true);
  };

  return {
    handleSubmit,
  };
};

export default AuthFormController;
