import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: "SignikaNegativeSCSemiBold",
    fontSize: 25,
    color: Colors.text.highlight,
  },
  dateContainer: {
    paddingVertical: 12,
    backgroundColor: Colors.brand.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  weekText: {
    fontFamily: "RobotoMedium",
    fontSize: 16,
    color: Colors.brand.base,
  },
  dayText: {
    fontFamily: "RobotoRegular",
    fontSize: 14,
  },
  dateText: {
    fontFamily: "RobotoMedium",
    fontSize: 16,
    color: Colors.brand.base,
    marginRight: 8,
  },
});
