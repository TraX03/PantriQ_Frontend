import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.ui.grayButtonFill,
    borderRadius: 99,
    paddingHorizontal: 10,
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomColor: Colors.ui.border,
    borderBottomWidth: 1,
  },
  tabText: {
    fontFamily: "RobotoRegular",
    fontSize: 18,
  },
  divider: {
    color: Colors.text.gray,
    marginHorizontal: 10,
    fontSize: 18,
  },
  noUserText: {
    color: Colors.text.gray,
    fontFamily: "RobotoRegular",
    fontSize: 16,
  },
  noFoundText: {
    color: Colors.text.gray,
    fontFamily: "RobotoRegular",
    fontSize: 16,
  },
  contentContainer: {
    backgroundColor: Colors.ui.background,
    flexGrow: 1,
    padding: 12,
  },
  titleText: {
    fontFamily: "RobotoRegular",
    fontSize: 18,
    color: Colors.ui.shade,
  },
  expandText: {
    color: Colors.brand.main,
    fontSize: 14,
    alignSelf: "flex-end",
    fontFamily: "RobotoMedium",
  },
  itemText: {
    color: Colors.brand.base,
    fontSize: 13,
  },
  itemContainer: {
    paddingHorizontal: 14,
    paddingVertical: 4, 
    borderRadius: 99,
    borderWidth: 1,
    alignSelf: "flex-start",
    borderColor: Colors.ui.base,
  },
});
