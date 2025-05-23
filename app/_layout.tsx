import LoadingScreen from "@/components/LoadingScreen";
import { useHydrateUser } from "@/hooks/useHydrateUser";
import store from "@/redux/store";
import { useFonts } from "expo-font";
import { Stack, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import "./global.css";

SplashScreen.preventAutoHideAsync();

function RootContent() {
  const insets = useSafeAreaInsets();
  const segments = useSegments();

  const isTabScreen = segments[0] === "(tabs)";

  useHydrateUser();

  return (
    <View style={{ flex: 1, paddingBottom: isTabScreen ? 7 : insets.bottom }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
      <LoadingScreen />
    </View>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    RobotoMedium: require("../assets/fonts/Roboto-Medium.ttf"),
    RobotoRegular: require("../assets/fonts/Roboto-Regular.ttf"),
    RobotoSemiBold: require("../assets/fonts/Roboto-SemiBold.ttf"),
    RobotoBold: require("../assets/fonts/Roboto-Bold.ttf"),
    RobotoSemiCondensed: require("../assets/fonts/Roboto_SemiCondensed-Regular.ttf"),
    SignikaNegativeSC: require("../assets/fonts/SignikaNegativeSC-Regular.ttf"),
    SignikaNegativeSCSemiBold: require("../assets/fonts/SignikaNegativeSC-SemiBold.ttf"),
    Afacad: require("../assets/fonts/Afacad-Regular.ttf"),
    AfacadMedium: require("../assets/fonts/Afacad-Medium.ttf"),
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
      <RootContent />
    </Provider>
  );
}
