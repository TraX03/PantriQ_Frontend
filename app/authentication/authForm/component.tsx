import React from "react";
//prettier-ignore
import { View, Text, TouchableOpacity, Image, Dimensions, StatusBar, Modal, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import Input from "@/components/Input";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { styles } from "../../../features/authentication/styles";
import { AuthFormActions } from "../../../features/authentication/actions";

type SocialProvider = "google" | "facebook" | "apple";

const socialProviders: Record<SocialProvider, any> = {
  google: require("@/assets/images/google.png"),
  facebook: require("@/assets/images/facebook.png"),
  apple: require("@/assets/images/apple.png"),
};

type Props = {
  mode: "signUp" | "signIn";
  auth: ReturnType<typeof AuthFormActions>;
  onSubmit: () => void;
};

export default function AuthFormComponent({ mode, auth: form, onSubmit }: Props) {
  const isSignIn = mode === "signIn";
  const { width, height } = Dimensions.get("window");
  const statusBarHeight = StatusBar.currentHeight || 0;

  return (
    <>
      <Modal
        visible={!isSignIn && !!form.passwordError}
        transparent
        animationType="fade"
      >
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="bg-white rounded-2xl p-6 w-72 shadow-lg">
            <Text className="text-base font-semibold mb-2 text-red-600">
              Password Error
            </Text>
            <Text className="text-sm text-gray-700">{form.passwordError}</Text>

            <Pressable
              onPress={() => form.setFieldState("showPasswordModal", false)}
              className="mt-4 self-end bg-red-500 px-4 py-2 rounded-full"
            >
              <Text className="text-white text-sm">OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <LinearGradient
        colors={[
          Colors.brand.secondary,
          Colors.brand.secondary,
          Colors.brand.primaryDark,
          Colors.brand.primaryDark,
        ]}
        locations={[0, 0.65, 0.75, 1]}
        style={{
          position: "absolute",
          width,
          height: height + statusBarHeight,
        }}
      >
        <View className="px-6 pt-[55px]">
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
          <View className="mb-2">
            <Input
              icon="person.fill"
              placeholder="Email"
              value={form.email}
              onChangeText={(text) => form.setFieldState("email", text)}
            />
            {!isSignIn && form.emailError ? (
              <Text
                style={{
                  fontFamily: "RobotoRegular",
                  fontSize: 12,
                  color: "#fc3030",
                }}
              >
                {form.emailError}
              </Text>
            ) : null}
          </View>

          <View className={isSignIn ? "mb-4" : "mb-14"}>
            <Input
              icon="lock.fill"
              placeholder="Password"
              value={form.password}
              onChangeText={(text) => form.setFieldState("password", text)}
              isPassword
            />
            {!isSignIn && form.passwordError ? (
              <Text
                style={{
                  fontFamily: "RobotoRegular",
                  fontSize: 12,
                  color: "#fc3030",
                }}
              >
                {form.passwordError}
              </Text>
            ) : null}
          </View>

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
    </>
  );
}
