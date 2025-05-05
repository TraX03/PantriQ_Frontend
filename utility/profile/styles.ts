import { StyleSheet, ViewStyle } from "react-native";
import { Colors } from "@/constants/Colors";

const baseButton: ViewStyle = {
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderRadius: 10,
};

export const styles = StyleSheet.create({
  // Layout Containers
  container: {
    flex: 1,
    backgroundColor: Colors.ui.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.brand.accent,
    paddingHorizontal: 8,
  },
  profileSection: {
    backgroundColor: Colors.brand.accent,
    paddingHorizontal: 20,
    paddingTop: 65,
    paddingBottom: 30,
  },
  editContainer: {
    flex: 1,
    backgroundColor: Colors.brand.accent,
    paddingTop: 65,
  },

  // Text Styles
  headerTitle: {
    fontSize: 18,
    marginLeft: 14,
    fontFamily: "RobotoMedium",
  },
  errorText: {
    fontSize: 16,
    fontFamily: "RobotoRegular",
    color: Colors.text.highlight,
    textAlign: "center",
  },
  username: {
    fontSize: 20,
    fontFamily: "RobotoSemiBold",
  },
  followInfo: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: "RobotoRegular",
    color: Colors.text.faint,
  },
  changeBgText: {
    fontSize: 13,
    fontFamily: "RobotoRegular",
  },
  tabTitleText: {
    color: Colors.ui.base,
    fontFamily: "RobotoMedium",
  },
  tabText: {
    marginRight: 10,
    fontFamily: "RobotoRegular",
  },
  genderOptionText: {
    fontSize: 14,
    fontFamily: "RobotoRegular",
    color: Colors.ui.base,
  },
  indicatorText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: "right",
    fontFamily: "RobotoRegular",
    color: Colors.text.gray,
  },
  inputPlaceholder: {
    fontFamily: "RobotoRegular",
    color: Colors.ui.base,
  },
  logoutButtonText: {
    fontSize: 16,
    fontFamily: "RobotoMedium",
    color: Colors.brand.accent,
  },
  saveButtonText: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "RobotoMedium",
    color: Colors.brand.accent,
  },

  // Buttons
  logoutButton: {
    ...baseButton,
    backgroundColor: Colors.ui.buttonFill,
    marginTop: 30,
    alignSelf: "center",
  },
  saveButton: {
    marginTop: 25,
    paddingVertical: 10,
    borderRadius: 12,
    width: 100,
    alignSelf: "flex-end",
    backgroundColor: Colors.brand.main,
  },
  changeBgButton: {
    position: "absolute",
    top: 15,
    right: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  // Input Fields
  inputBox: {
    marginTop: 12,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors.ui.border,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 56,
    fontSize: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },

  // Misc Components
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 9999,
    alignSelf: "center",
    backgroundColor: Colors.text.placeholder,
  },
  radioButtom: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: Colors.brand.main,
  },
  fieldTab: {
    paddingVertical: 3,
    backgroundColor: Colors.brand.accent,
    borderColor: Colors.text.placeholder,
  },
});

export const getAvatarContainerStyle = (
  borderColor = Colors.brand.accent
): ViewStyle => ({
  width: 90,
  height: 90,
  borderRadius: 56,
  overflow: "hidden",
  borderWidth: 2,
  borderColor,
});
