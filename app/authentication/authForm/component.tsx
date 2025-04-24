import React from "react";
//prettier-ignore
import { View, Text, TouchableOpacity, Image, Dimensions, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import Input from "@/components/input";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { styles } from "../styles";

type Props = {
  mode: "signIn" | "signUp";
  email: string;
  password: string;
  setEmail: (val: string) => void;
  setPassword: (val: string) => void;
  onSubmit: () => void;
};

type SocialProvider = "google" | "facebook" | "apple";

const socialProviders: Record<SocialProvider, any> = {
  google: require("@/assets/images/google.png"),
  facebook: require("@/assets/images/facebook.png"),
  apple: require("@/assets/images/apple.png"),
};

export default function AuthFormComponent({
  mode,
  email,
  password,
  setEmail,
  setPassword,
  onSubmit,
}: Props) {
  const isSignIn = mode === "signIn";
  const { width, height } = Dimensions.get("window");
  const statusBarHeight = StatusBar.currentHeight || 0;

  return (
    <LinearGradient
      colors={[
        Colors.brand.secondary,
        Colors.brand.secondary,
        Colors.brand.primaryDark,
        Colors.brand.primaryDark,
      ]}
      locations={[0, 0.65, 0.75, 1]}
      style={{ position: "absolute", width, height: height + statusBarHeight }}
    >
      <View className="px-6 pt-[60px]">
        {/* Back button */}
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol
            name="chevron.left"
            color={Colors.brand.primaryDark}
            size={30}
          />
        </TouchableOpacity>

        {/* Logo */}
        <Image
          source={require("@/assets/images/pantriQ.png")}
          className="w-full h-[170px] self-center"
          resizeMode="contain"
        />

        {/* Title */}
        <Text
          className="mt-3 mb-3 text-[20px]"
          style={{
            fontFamily: "SignikaNegativeSC",
            color: Colors.brand.primaryDark,
          }}
        >
          {isSignIn ? "Sign In" : "Sign Up"}
        </Text>

        {/* Input */}
        <Input
          icon="person.fill"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          icon="lock.fill"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          className={isSignIn ? "mb-4" : "mb-14"}
          isPassword
        />

        {/* Forgot password */}
        {isSignIn && (
          <Text
            className="text-right mb-6"
            style={{
              color: Colors.brand.primaryDark,
              fontFamily: "RobotoBold",
            }}
          >
            Forgot Password?
          </Text>
        )}

        {/* Submit button */}
        <TouchableOpacity
          className="items-center py-3 mb-24 rounded-xl"
          style={{ backgroundColor: Colors.ui.buttonFill }}
          onPress={onSubmit}
        >
          <Text
            className="text-lg"
            style={{
              fontFamily: "RobotoMedium",
              color: Colors.brand.secondary,
            }}
          >
            {isSignIn ? "Sign In" : "Sign Up"}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center justify-center mb-6">
          <View style={styles.dividerStyle} />
          <Text className="px-4" style={styles.darkBgTextStyle}>
            or sign in with
          </Text>
          <View style={styles.dividerStyle} />
        </View>

        {/* Social buttons */}
        <View className="flex-row justify-center gap-2 mb-6">
          {["google", "facebook", "apple"].map((provider) => (
            <Image
              key={provider}
              source={socialProviders[provider as SocialProvider]}
              className="w-[60px] h-[60px]"
              resizeMode="contain"
            />
          ))}
        </View>

        {/* Footer */}
        <View className="items-center mb-10">
          <TouchableOpacity
            onPress={() =>
              router.replace(
                `/authentication/${isSignIn ? "sign-up" : "sign-in"}`
              )
            }
          >
            <Text style={styles.darkBgTextStyle}>
              {isSignIn ? (
                <>
                  Don't have an account?{" "}
                  <Text style={styles.underlineText}>Sign Up</Text>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Text style={styles.underlineText}>Sign In</Text>
                </>
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}
