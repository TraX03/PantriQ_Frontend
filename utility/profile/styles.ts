import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Layout Containers
  container: {
    flex: 1,
    backgroundColor: Colors.surface.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.brand.onPrimary,
    paddingHorizontal: 8,
  },
  profileSection: {
    backgroundColor: Colors.brand.onPrimary,
    paddingHorizontal: 20,
    paddingTop: 65,
    paddingBottom: 30,
  },
  headerContainer: {
    flex: 1,
    backgroundColor: Colors.brand.onPrimary,
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
    backgroundColor: Colors.surface.background,
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
    color: Colors.brand.onPrimary,
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
    color: Colors.text.primary,
    fontFamily: "RobotoMedium",
  },
  tabText: {
    marginRight: 10,
    fontFamily: "RobotoRegular",
  },
  genderOptionText: {
    fontSize: 14,
    fontFamily: "RobotoRegular",
    color: Colors.text.primary,
  },
  indicatorText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: "right",
    fontFamily: "RobotoRegular",
    color: Colors.text.disabled,
  },
  inputPlaceholder: {
    fontFamily: "RobotoRegular",
    color: Colors.text.primary,
  },
  logoutButtonText: {
    fontSize: 16,
    fontFamily: "RobotoMedium",
    color: Colors.brand.onPrimary,
  },
  saveButtonText: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "RobotoMedium",
    color: Colors.brand.onPrimary,
  },
  bioText: {
    color: Colors.brand.onPrimary,
    fontFamily: "RobotoRegular",
    paddingTop: 25,
  },
  loginText: {
    color: Colors.brand.onPrimary,
    fontFamily: "RobotoRegular",
  },
  profileTabText: {
    color: Colors.brand.onPrimary,
    marginTop: 6,
    fontSize: 13,
    fontFamily: "RobotoRegular",
  },
  noPostText: {
    color: Colors.text.disabled,
    fontFamily: "RobotoRegular",
    alignSelf: "center",
    marginTop: 10,
  },

  // Buttons
  logoutButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.surface.buttonPrimary,
    marginTop: 30,
    alignSelf: "center",
  },
  saveButton: {
    marginTop: 25,
    paddingVertical: 10,
    borderRadius: 12,
    width: 100,
    alignSelf: "flex-end",
    backgroundColor: Colors.surface.buttonPrimary,
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
    backgroundColor: Colors.overlay.base,
    marginLeft: 4,
  },
  followButton: {
    borderRadius: 99,
    paddingHorizontal: 25,
    paddingVertical: 5,
  },

  // Input Fields
  inputBox: {
    marginTop: 12,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors.surface.border,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 45,
    fontSize: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.surface.border,
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
    backgroundColor: Colors.brand.primary,
  },
  fieldTab: {
    paddingVertical: 3,
    backgroundColor: Colors.brand.onPrimary,
    borderColor: Colors.text.placeholder,
  },
  profileTab: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.overlay.lightBlue,
    minWidth: 90,
    height: 80,
    marginRight: 12,
  },
  tabHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomColor: Colors.text.disabled,
    borderBottomWidth: 1,
    paddingVertical: 13,
    backgroundColor: Colors.brand.onPrimary,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  settingsTab: {
    borderColor: Colors.surface.border,
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
    backgroundColor: Colors.brand.onPrimary,
    height: 40,
    alignItems: "center",
    borderBottomColor: Colors.surface.border,
    borderBottomWidth: 1,
    gap: 20,
  },
});
