import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

const baseTextStyle = {
  fontFamily: "RobotoRegular",
  color: Colors.brand.dark,
};

const mediumText = {
  fontFamily: "RobotoMedium",
  color: Colors.brand.accent,
};

export const styles = StyleSheet.create({
  // Text
  titleText: {
    ...baseTextStyle,
    marginTop: 12,
    marginBottom: 12,
    fontSize: 20,
    fontFamily: "SignikaNegativeSC",
  },
  forgotPasswordText: {
    fontFamily: "RobotoBold",
    color: Colors.brand.dark,
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
    marginBottom: 96,
    borderRadius: 12,
    backgroundColor: Colors.ui.buttonFill,
  },

  // Divider
  dividerStyle: {
    width: 80,
    height: 1,
    backgroundColor: Colors.brand.accent,
  },
});
