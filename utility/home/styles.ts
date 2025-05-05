import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

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
  },
  suggestContainer: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: Colors.brand.accent,
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
});
