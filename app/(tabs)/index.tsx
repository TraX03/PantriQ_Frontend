import { Routes } from "@/constants/Routes";
import { useReduxSelectors } from "@/hooks/useReduxSelectors";
import { setLoading } from "@/redux/slices/loadingSlice";
import { AppDispatch } from "@/redux/store";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import HomeContainer from "../home/container";

if (__DEV__) {
  require("@/ReactotronConfig");
}

export default function HomeScreenRoute() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, onboarded } = useReduxSelectors();

  useEffect(() => {
    if (user && onboarded === false) {
      router.replace(Routes.Onboarding);
      dispatch(setLoading(false));
    }
  }, [user, onboarded]);

  return <HomeContainer />;
}
