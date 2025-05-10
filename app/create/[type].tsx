import { Stack } from "expo-router";
import CreateFormContainer from "./createForm/container";

export default function AuthScsreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <CreateFormContainer />
    </>
  );
}