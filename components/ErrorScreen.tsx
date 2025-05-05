import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "@/utility/profile/styles";
import LottieView from "lottie-react-native";
import { router, Stack } from "expo-router";
import { IconSymbol } from "./ui/IconSymbol";
import { Colors } from "@/constants/Colors";

type Props = {
  message: string;
};

const ErrorScreen: React.FC<Props> = ({ message }) => (
  <>
    <Stack.Screen options={{ headerShown: false }} />
    <View style={styles.centeredContainer}>
      <View className="absolute top-20 left-3 self-start">
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol
            name="chevron.left"
            color={Colors.brand.main}
            size={30}
          />
        </TouchableOpacity>
      </View>
      <LottieView
        source={require("@/assets/animations/404-error.json")}
        autoPlay
        loop={true}
        style={{ width: 200, height: 200 }}
      />
      <Text style={styles.errorText}>{message}</Text>
    </View>
  </>
);

export default ErrorScreen;
