import React from "react";
import AuthFormComponent from "./component";
import AuthFormController from "./controller";
import { useFieldState } from "@/hooks/useFieldState";

export type Props = {
  mode: "sign-in" | "sign-up";
};

export default function AuthFormContainer({ mode }: Props) {
  const auth = useFieldState({
    email: "",
    password: "",
    errorTitle: "",
    errorMessage: "",
    showErrorModal: false,
  });

  const controller = AuthFormController({ mode, form: auth });

  return (
    <AuthFormComponent
      mode={mode === "sign-up" ? "signUp" : "signIn"}
      auth={auth}
      onSubmit={controller.handleSubmit}
    />
  );
}