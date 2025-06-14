import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface.border,
  },
  border: {
    marginTop: 5,
    height: 2,
    width: 55,
    backgroundColor: Colors.brand.primary,
    borderRadius: 1,
  },
});
