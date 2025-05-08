import React from "react";
//prettier-ignore
import { View, Text, TouchableOpacity, Image, Dimensions, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import InputBox from "@/components/InputBox";
import NotificationModal from "@/components/NotifcationModal";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { styles } from "../../../utility/authentication/styles";
import { useFieldState } from "@/hooks/useFieldState";

const SOCIAL_PROVIDERS = {
  google: require("@/assets/images/google.png"),
  facebook: require("@/assets/images/facebook.png"),
  apple: require("@/assets/images/apple.png"),
};

export interface AuthFormState {
  email: string;
  password: string;
  errorTitle: string;
  errorMessage: string;
  showErrorModal: boolean;
}

type Props = {
  mode: "signUp" | "signIn";
  auth: ReturnType<typeof useFieldState<AuthFormState>>;
  onSubmit: () => void;
};

export default function AuthFormComponent({ mode, auth, onSubmit }: Props) {
  const { width, height } = Dimensions.get("window");
  const statusBarHeight = StatusBar.currentHeight || 0;

  const {
    email,
    password,
    showErrorModal,
    errorTitle,
    errorMessage,
    setFieldState,
  } = auth;

  const isSignIn = mode === "signIn";

  return (
    <>
      <NotificationModal
        visible={showErrorModal}
        errorTitle={errorTitle}
        errorMessage={errorMessage}
        onClose={() => {
          setFieldState("showErrorModal", false);
          setFieldState("errorMessage", "");
        }}
      />

      <LinearGradient
        colors={[
          Colors.brand.accent,
          Colors.brand.accent,
          Colors.brand.dark,
          Colors.brand.dark,
        ]}
        locations={[0, 0.66, 0.76, 1]}
        style={{
          position: "absolute",
          width,
          height: height + statusBarHeight,
        }}
      >
        <View className="px-6 pt-20">
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol
              name="chevron.left"
              color={Colors.brand.dark}
              size={30}
            />
          </TouchableOpacity>

          <Image
            source={require("@/assets/images/pantriQ.png")}
            className="w-full h-[160px] self-center"
            resizeMode="contain"
          />

          <Text style={styles.titleText}>
            {isSignIn ? "Sign In" : "Sign Up"}
          </Text>

          <InputBox
            icon="person.fill"
            placeholder="Email"
            value={email}
            onChangeText={(text) => setFieldState("email", text.trim())}
          />

          <InputBox
            icon="lock.fill"
            placeholder="Password"
            value={password}
            onChangeText={(text) => setFieldState("password", text.trim())}
            isPassword
            className={isSignIn ? "mb-4" : "mb-14"}
          />

          {isSignIn && (
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          )}

          <TouchableOpacity style={styles.buttonStyle} onPress={onSubmit}>
            <Text style={styles.buttonText}>
              {isSignIn ? "Sign In" : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center justify-center mb-6">
            <View style={styles.dividerStyle} />
            <Text style={styles.dividerText}> or continue with</Text>
            <View style={styles.dividerStyle} />
          </View>

          <View className="flex-row justify-center gap-2 mb-6">
            {Object.keys(SOCIAL_PROVIDERS).map((provider) => (
              <TouchableOpacity
                key={provider}
                onPress={() => {}}
              >
                <Image
                  source={
                    SOCIAL_PROVIDERS[provider as keyof typeof SOCIAL_PROVIDERS]
                  }
                  className="w-[60px] h-[60px]"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </View>

          <View className="items-center mb-10">
            <TouchableOpacity
              onPress={() =>
                router.replace(
                  `/authentication/${isSignIn ? "sign-up" : "sign-in"}`
                )
              }
            >
              <Text style={styles.dividerText}>
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
