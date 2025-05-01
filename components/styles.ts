import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

const baseTextStyle = {
  fontFamily: "RobotoRegular",
  color: Colors.text.faint,
  fontSize: 12,
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingBottom: 14,
    backgroundColor: Colors.brand.secondary,
  },
  communityName: {
    fontSize: 16,
    fontFamily: "RobotoMedium",
    marginBottom: 8,
  },
  communityText: {
    ...baseTextStyle,
    paddingBottom: 8,
  },
  joinButton: {
    backgroundColor: Colors.brand.primaryLight,
    borderColor: Colors.brand.secondary,
  },
  joinButtonText: {
    ...baseTextStyle,
    color: Colors.brand.secondary,
    fontSize: 14,
  },
  postTitle: {
    fontSize: 14,
    fontFamily: "RobotoMedium",
    marginBottom: 10,
    color: Colors.ui.base,
  },
  author: {
    ...baseTextStyle,
    fontSize: 11,
    flexShrink: 1,
    flexGrow: 1,
    overflow: "hidden",
  },
  errorTitle: {
    fontFamily: "RobotoSemiBold",
    color: Colors.text.dark,
    fontSize: 17,
  },
  errorDescription: {
    ...baseTextStyle,
    color: Colors.ui.base,
    fontSize: 14,
  },
  buttonText: {
    fontFamily: "RobotoMedium",
    color: Colors.brand.secondary,
  },
});

export default styles;
