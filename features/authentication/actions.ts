import { useState } from "react";

interface AuthFormState {
  email: string;
  password: string;
  errorTitle: string;
  errorMessage: string;
  showErrorModal: boolean;
}

export function AuthFormActions() {
  const [state, setState] = useState<AuthFormState>({
    email: "",
    password: "",
    errorTitle: "",
    errorMessage: "",
    showErrorModal: false,
  });

  const setFieldState = (field: keyof typeof state, value: any) => {
    setState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    ...state,
    setFieldState,
  };
}
