import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ui.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 2,
    paddingTop: 65,
    backgroundColor: Colors.brand.secondary,
  },
  tabText: {
    fontSize: 23,
    marginRight: 18,
    fontFamily: "RobotoMedium",
  },
  suggestContainer: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: Colors.brand.secondary,
  },
  suggestText: {
    fontFamily: "RobotoRegular",
    fontSize: 14,
  }
});
