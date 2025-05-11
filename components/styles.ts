import { StatusBar, StyleSheet } from "react-native";
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
    backgroundColor: Colors.brand.accent,
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
    backgroundColor: Colors.brand.light,
    borderColor: Colors.brand.accent,
  },
  joinButtonText: {
    ...baseTextStyle,
    color: Colors.brand.accent,
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
    color: Colors.text.highlight,
    fontSize: 17,
  },
  errorDescription: {
    ...baseTextStyle,
    color: Colors.ui.base,
    fontSize: 14,
  },
  buttonText: {
    fontFamily: "RobotoMedium",
    color: Colors.brand.accent,
  },
  addModalSheet: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    height: 150,
    width: 270,
    alignSelf: "center",
    borderColor: Colors.ui.shadow,
    borderWidth: 1.5,
    zIndex: 1,
    marginBottom: StatusBar.currentHeight || 0,
  },
  addModalText: {
    fontSize: 16,
    fontFamily: "RobotoRegular",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.ui.overlayDark,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles;
