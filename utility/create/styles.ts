import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export const styles = StyleSheet.create({
  // Layout Containers
  headerContainer: {
    flex: 1,
    backgroundColor: Colors.brand.accent,
    paddingTop: 65,
    paddingHorizontal: 16,
  },
  inputTitle: {
    fontFamily: "RobotoMedium",
    fontSize: 17,
    marginBottom: 8,
  },
});
