import { useLocalSearchParams, Stack } from "expo-router";
import AuthFormContainer from "./authForm/container";

export default function AuthScsreen() {
  const { mode } = useLocalSearchParams();
  const formMode = mode === "sign-up" ? "sign-up" : "sign-in";

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AuthFormContainer mode={formMode} />
    </>
  );
};