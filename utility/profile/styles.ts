import { StyleSheet, ViewStyle } from "react-native";
import { Colors } from "@/constants/Colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ui.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.brand.secondary,
    paddingHorizontal: 8,
  },
  errorText: {
    fontSize: 16,
    fontFamily: "RobotoRegular",
    color: Colors.text.dark,
    textAlign: "center",
  },
  profileSection: {
    backgroundColor: Colors.brand.secondary,
    paddingHorizontal: 20,
    paddingTop: 65,
    paddingBottom: 30,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 9999,
    alignSelf: "center",
    backgroundColor: Colors.text.placeholder,
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
  logoutButton: {
    backgroundColor: Colors.ui.buttonFill,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 30,
    alignSelf: "center",
  },
  logoutButtonText: {
    color: Colors.brand.secondary,
    fontSize: 16,
    fontFamily: "RobotoMedium",
  },
});

export const getAvatarContainerStyle = (
  borderColor = Colors.brand.secondary
) => ({
  width: 90,
  height: 90,
  borderRadius: 56,
  overflow: "hidden" as ViewStyle["overflow"],
  borderWidth: 2,
  borderColor,
});
