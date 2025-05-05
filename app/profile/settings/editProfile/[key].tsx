import { Stack } from "expo-router";
import EditFieldContainer from "./editField/container";

export default function AuthScsreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <EditFieldContainer />
    </>
  );
}
