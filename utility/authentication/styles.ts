import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

const baseTextStyle = {
  fontFamily: "RobotoRegular",
  color: Colors.brand.primaryDark,
};

export const styles = StyleSheet.create({
  titleText: {
    ...baseTextStyle,
    marginTop: 12,
    marginBottom: 12,
    fontSize: 20,
    fontFamily: "SignikaNegativeSC",
  },
  forgotPasswordText: {
    ...baseTextStyle,
    textAlign: "right",
    marginBottom: 24,
    fontFamily: "RobotoBold",
  },
  buttonStyle: {
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 96,
    borderRadius: 12,
    backgroundColor: Colors.ui.buttonFill,
  },
  buttonText: {
    ...baseTextStyle,
    fontFamily: "RobotoMedium",
    color: Colors.brand.secondary,
    fontSize: 16,
    lineHeight: 25,
  },
  dividerText: {
    ...baseTextStyle,
    color: Colors.brand.secondary,
    fontSize: 15,
    paddingHorizontal: 16,
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
