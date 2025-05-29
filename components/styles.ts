import { Colors } from "@/constants/Colors";
import { StatusBar, StyleSheet } from "react-native";

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
    paddingBottom: (StatusBar.currentHeight ?? 0) + 80,
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
  userCardContainer: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: Colors.brand.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  usernameText: {
    fontFamily: "RobotoMedium",
    fontSize: 16,
    color: Colors.brand.base,
    marginBottom: 6,
  },
  bioText: {
    fontFamily: "RobotoRegular",
    fontSize: 14,
    color: Colors.text.gray,
    width: "80%",
  },
  modalAddButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.ui.buttonFill,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  resultText: {
    color: Colors.brand.base,
    fontSize: 16,
  },
  endText: {
    color: Colors.text.secondary,
    fontSize: 14,
  },
  addText: {
    color: Colors.text.secondary,
    fontSize: 14,
    textDecorationLine: "underline",
    marginTop: 4,
    textAlign: "right",
  },
  toastContainer: {
    backgroundColor: Colors.ui.inactive,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    maxWidth: "70%",
    marginTop: 10,
    elevation: 4,
  },
  toastText: {
    color: Colors.brand.accent,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  toastSubText: {
    color: Colors.text.placeholder,
    fontSize: 14,
    marginTop: 4,
  },
});

export default styles;
