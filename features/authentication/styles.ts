import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

const baseTextStyle = {
  fontFamily: "RobotoRegular",
  color: Colors.brand.primaryDark,
};

export const styles = StyleSheet.create({
  titleText: {
    ...baseTextStyle,
    fontFamily: "SignikaNegativeSC",
  },

  forgotPasswordText: {
    ...baseTextStyle,
    fontFamily: "RobotoBold",
  },

  buttonText: {
    ...baseTextStyle,
    fontFamily: "RobotoMedium",
    color: Colors.brand.secondary,
    fontSize: 16,
    lineHeight: 25
  },

  darkBgTextStyle: {
    ...baseTextStyle,
    color: Colors.brand.secondary,
    fontSize: 15,
  },

  underlineText: {
    textDecorationLine: "underline",
  },

  dividerStyle: {
    width: 80,
    height: 1,
    backgroundColor: Colors.brand.secondary,
  },
});
