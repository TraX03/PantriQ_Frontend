import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "./global.css";

import { Provider } from "react-redux";
import store from "@/redux/store";
import LoadingScreen from "@/components/LoadingScreen";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    RobotoMedium: require("../assets/fonts/Roboto-Medium.ttf"),
    RobotoRegular: require("../assets/fonts/Roboto-Regular.ttf"),
    RobotoSemiBold: require("../assets/fonts/Roboto-SemiBold.ttf"),
    RobotoBold: require("../assets/fonts/Roboto-Bold.ttf"),
    RobotoSemiCondensed: require("../assets/fonts/Roboto_SemiCondensed-Regular.ttf"),
    SignikaNegativeSC: require("../assets/fonts/SignikaNegativeSC-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
      <LoadingScreen />
    </Provider>
  );
}
