import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

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
  headerContainer: {
    flex: 1,
    backgroundColor: Colors.brand.accent,
    paddingTop: 60,
  },
  avatarContainer: {
    width: 88,
    height: 88,
    borderRadius: 56,
    overflow: "hidden",
    elevation: 7,
  },
  postListContainer: {
    backgroundColor: Colors.ui.background,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: -15,
  },
  loadingContianer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
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
    color: Colors.brand.accent,
  },
  followInfo: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: "RobotoRegular",
    color: Colors.text.muted,
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
  bioText: {
    color: Colors.brand.accent,
    fontFamily: "RobotoRegular",
    paddingTop: 25,
  },
  loginText: {
    color: Colors.brand.accent,
    fontFamily: "RobotoRegular",
  },
  profileTabText: {
    color: Colors.brand.accent,
    marginTop: 6,
    fontSize: 13,
    fontFamily: "RobotoRegular",
  },
  noPostText: {
    color: Colors.text.faint,
    fontFamily: "RobotoRegular",
    alignSelf: "center",
    marginTop: 10,
  },

  // Buttons
  logoutButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
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
    backgroundColor: Colors.ui.buttonFill,
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
    borderWidth: 1,
  },
  loginButton: {
    borderRadius: 9999,
    paddingHorizontal: 24,
    paddingVertical: 4,
    backgroundColor: Colors.ui.overlay,
    marginLeft: 4,
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
    paddingRight: 45,
    fontSize: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },

  // Misc Components
  avatar: {
    width: "100%",
    height: "100%",
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
  profileTab: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.ui.lightBlueOverlay,
    minWidth: 90,
    height: 80,
    marginRight: 12,
  },
  tabHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomColor: Colors.text.faint,
    borderBottomWidth: 1,
    paddingVertical: 13,
    backgroundColor: Colors.brand.accent,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  settingsTab: {
    borderColor: Colors.ui.border,
    borderTopWidth: 1.2,
    borderBottomWidth: 1.2,
    padding: 25,
    alignItems: "center",
    flexDirection: "row",
  },
  subTabHeader: {
    flexDirection: "row",
    marginBottom: 16,
    paddingHorizontal: 10,
    backgroundColor: Colors.brand.accent,
    height: 40,
    alignItems: "center",
    borderBottomColor: Colors.ui.border,
    borderBottomWidth: 1,
    gap: 20,
  },
});
