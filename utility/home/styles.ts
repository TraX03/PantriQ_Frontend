import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: Colors.ui.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingTop: 65,
    paddingHorizontal: 16,
    marginBottom: 2,
    backgroundColor: Colors.brand.accent,
    zIndex: 10,
    paddingBottom: 8,
  },
  suggestContainer: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: Colors.brand.accent,
    zIndex: 9,
  },

  // Text
  tabText: {
    fontSize: 23,
    fontFamily: "RobotoMedium",
    marginRight: 18,
  },
  suggestText: {
    fontFamily: "RobotoRegular",
    color: Colors.brand.dark,
    fontSize: 14,
  },
  endText: {
    color: Colors.text.gray,
    fontFamily: "RobotoRegular",
    fontSize: 14,
    marginHorizontal: 10,
  },
  divider: {
    width: 60,
    height: 1,
    backgroundColor: Colors.text.gray,
  },
});
