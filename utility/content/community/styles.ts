import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  info: {
    backgroundColor: Colors.brand.onPrimary,
    position: "absolute",
    top: 200,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    zIndex: 1,
    padding: 22,
  },
  joinButton: {
    backgroundColor: Colors.brand.primary,
    width: 90,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  joinText: {
    fontFamily: "RobotoMedium",
    color: Colors.brand.onPrimary,
    fontSize: 16,
  },
  title: {
    fontFamily: "RobotoBold",
    fontSize: 28,
  },
  stats: {
    color: Colors.text.disabled,
    marginTop: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomColor: Colors.surface.border,
    borderBottomWidth: 1,
    paddingVertical: 15,
    backgroundColor: Colors.brand.onPrimary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  generateButton: {
    position: "absolute",
    bottom: 75,
    right: 15,
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: Colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    paddingHorizontal: 4,
  },
});
