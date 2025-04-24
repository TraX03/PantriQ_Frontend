import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export const styles = StyleSheet.create({
  darkBgTextStyle: {
    fontFamily: "RobotoRegular",
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

export default styles;
