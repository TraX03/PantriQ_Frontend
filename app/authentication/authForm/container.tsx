import React, { useState } from "react";
import AuthFormComponent from "./component";
import AuthFormController from "./controller";

type Props = {
  mode: "sign-in" | "sign-up";
};

export default function AuthFormContainer({ mode }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleSubmit } = AuthFormController(mode);

  return (
    <AuthFormComponent
      mode={mode === "sign-up" ? "signUp" : "signIn"}
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      onSubmit={() => handleSubmit(email, password)}
    />
  );
}
