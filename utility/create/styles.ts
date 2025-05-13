import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

const BaseInputBox = {
  borderWidth: 1,
  borderColor: Colors.ui.border,
  borderRadius: 6,
  paddingHorizontal: 8,
  paddingVertical: 4,
};

export const styles = StyleSheet.create({
  // Layout Containers
  headerContainer: {
    flex: 1,
    backgroundColor: Colors.brand.accent,
    paddingTop: 65,
    paddingHorizontal: 16,
  },

  // Text
  inputTitle: {
    fontFamily: "RobotoMedium",
    fontSize: 18,
    marginBottom: 8,
  },
  linkText: {
    color: Colors.text.link,
    fontFamily: "RobotoRegular",
    marginBottom: 8,
  },
  stepText: {
    fontFamily: "RobotoMedium",
    color: Colors.brand.main,
    marginBottom: 8,
    marginTop: 4,
    fontSize: 16,
  },
  stepButtonText: {
    textAlign: "center",
    fontFamily: "RobotoRegular",
    color: Colors.brand.accent,
  },

  // Button
  addImageButton: {
    backgroundColor: Colors.ui.grayButtonFill,
    elevation: 2,
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    borderRadius: 9999,
    backgroundColor: Colors.ui.overlayLight,
  },
  addStepButton: {
    backgroundColor: Colors.brand.main,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },

  // Misc
  inputValue: {
    ...BaseInputBox,
    flex: 1,
  },
  inputQuantity: {
    ...BaseInputBox,
    width: 80,
  },
  suggestionBox: {
    position: "absolute",
    top: "100%",
    left: 0,
    backgroundColor: Colors.brand.accent,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    elevation: 3,
    zIndex: 10,
  },
});
