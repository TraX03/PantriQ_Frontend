import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

const baseTextStyle = {
  fontFamily: "RobotoRegular",
  color: Colors.brand.primaryDark,
};

const mediumText = {
  fontFamily: "RobotoMedium",
  color: Colors.brand.onPrimary,
};

export const styles = StyleSheet.create({
  // Text
  titleText: {
    ...baseTextStyle,
    marginTop: 16,
    marginBottom: 12,
    fontSize: 20,
    fontFamily: "SignikaNegativeSC",
  },
  forgotPasswordText: {
    fontFamily: "RobotoBold",
    color: Colors.brand.primaryDark,
    textAlign: "right",
    marginBottom: 24,
  },
  buttonText: {
    ...mediumText,
    fontSize: 16,
    lineHeight: 25,
  },
  dividerText: {
    ...mediumText,
    fontSize: 15,
    paddingHorizontal: 16,
  },
  underlineText: {
    textDecorationLine: "underline",
  },

  // Button
  buttonStyle: {
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 65,
    borderRadius: 12,
    backgroundColor: Colors.surface.buttonPrimary,
  },

  // Divider
  dividerStyle: {
    width: 80,
    height: 1,
    backgroundColor: Colors.brand.onPrimary,
  },

  //misc
  input: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 6,
    backgroundColor: Colors.brand.onPrimary,
    borderColor: Colors.brand.primary,
  },
});
