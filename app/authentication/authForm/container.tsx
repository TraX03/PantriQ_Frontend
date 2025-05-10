import React from "react";
import AuthFormComponent from "./component";
import { useAuthController, AuthMode } from "./controller";

export type Props = {
  mode: "sign-in" | "sign-up";
};

export default function AuthFormContainer({ mode }: Props) {
  const authMode: AuthMode = mode === "sign-up" ? "signUp" : "signIn";

  const { authForm, handleSubmit, updateField, closeErrorModal } =
    useAuthController(authMode);

  return (
    <AuthFormComponent
      mode={authMode}
      auth={authForm}
      onSubmit={handleSubmit}
      updateField={updateField}
      closeErrorModal={closeErrorModal}
    />
  );
}
