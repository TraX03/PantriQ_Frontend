import { RootState } from "@/redux/store";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";

export function useRequireLogin() {
  const isLoggedIn = useSelector((state: RootState) => !!state.auth.user);
  const router = useRouter();

  const checkLogin = (next: string | (() => void)) => {
    if (isLoggedIn) {
      typeof next === "function" ? next() : router.push(next as never);
    } else {
      const redirectTo = typeof next === "string" ? next : "/";
      router.push(
        `/authentication/sign-in?redirect=${encodeURIComponent(redirectTo)}`
      );
    }
  };

  return { checkLogin };
}
