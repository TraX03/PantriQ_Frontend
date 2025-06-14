import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface.buttonSecondary,
    borderRadius: 99,
    paddingHorizontal: 10,
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomColor: Colors.surface.border,
    borderBottomWidth: 1,
  },
  tabText: {
    fontFamily: "RobotoRegular",
    fontSize: 18,
  },
  divider: {
    color: Colors.text.disabled,
    marginHorizontal: 10,
    fontSize: 18,
  },
  noUserText: {
    color: Colors.text.disabled,
    fontFamily: "RobotoRegular",
    fontSize: 16,
  },
  noFoundText: {
    color: Colors.text.disabled,
    fontFamily: "RobotoRegular",
    fontSize: 16,
  },
  contentContainer: {
    backgroundColor: Colors.surface.background,
    flexGrow: 1,
  },
  titleText: {
    fontFamily: "RobotoRegular",
    fontSize: 18,
    color: Colors.overlay.subtleDark,
  },
  expandText: {
    color: Colors.brand.primary,
    fontSize: 14,
    alignSelf: "flex-end",
    fontFamily: "RobotoMedium",
  },
  itemText: {
    color: Colors.brand.onBackground,
    fontSize: 13,
  },
  itemContainer: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 1,
    alignSelf: "flex-start",
    borderColor: Colors.text.primary,
  },
});
