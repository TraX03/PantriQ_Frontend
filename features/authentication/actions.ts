import { useState } from "react";

export function AuthFormActions() {
  const [state, setState] = useState({
    email: "",
    password: "",
    emailError: "",
    passwordError: "",
    showPasswordModal: false,
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
