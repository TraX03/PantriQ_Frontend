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
  slideModalSheet: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    width: 270,
    alignSelf: "center",
    borderColor: Colors.ui.shadow,
    borderWidth: 1.5,
    paddingBottom: (StatusBar.currentHeight ?? 0) + 50,
    marginBottom: -3,
  },
  addModalText: {
    fontSize: 16,
    fontFamily: "RobotoRegular",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.ui.fullScreenOverlay,
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  divider: {
    width: "30%",
    height: 2,
    borderRadius: 100,
    backgroundColor: Colors.text.placeholder,
    alignSelf: "center",
    marginBottom: 20,
    elevation: 1,
  },
  stepText: {
    fontSize: 16,
    fontFamily: "RobotoMedium",
    marginBottom: 8,
    color: Colors.brand.main,
  },
  stepImage: {
    width: "100%",
    height: 200,
    marginBottom: 18,
  },
  stepDescription: {
    color: Colors.ui.base,
    lineHeight: 22,
    fontSize: 15,
    fontFamily: "RobotoRegular",
  },
});

export default styles;
