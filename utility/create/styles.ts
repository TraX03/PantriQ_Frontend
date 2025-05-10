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
    fontSize: 16,
    marginBottom: 8,
  },
  linkText: {
    color: Colors.text.link,
    fontFamily: "RobotoRegular",
    marginBottom: 8,
  },

  // Button
  addImageButton: {
    backgroundColor: Colors.ui.border,
    opacity: 0.3,
    elevation: 2,
  },

  // Misc
  inputIngredient: {
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
    width: "69%",
    backgroundColor: Colors.brand.accent,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    elevation: 3,
    zIndex: 10,
  },
});
