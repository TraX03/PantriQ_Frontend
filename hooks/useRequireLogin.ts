import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "expo-router";

export function useRequireLogin() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const router = useRouter();

  const checkLogin = (onAuthenticated: () => void) => {
    if (isLoggedIn) {
      onAuthenticated();
    } else {
      router.push("/authentication/sign-in");
    }
  };

  return { checkLogin };
}
