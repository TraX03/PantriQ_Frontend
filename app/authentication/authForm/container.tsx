import React from "react";
import AuthFormComponent from "./component";
import AuthFormController from "./controller";
import { AuthFormActions } from "../../../utility/authentication/actions";

type Props = {
  mode: "sign-in" | "sign-up";
};

export default function AuthFormContainer({ mode }: Props) {
  const auth = AuthFormActions();
  const controller = AuthFormController({ mode, form: auth });

  return (
    <AuthFormComponent
      mode={mode === "sign-up" ? "signUp" : "signIn"}
      auth={auth}
      onSubmit={controller.handleSubmit}
    />
  );
}
