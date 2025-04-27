import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

const styles = StyleSheet.create({
  recipeimage: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 8,
  },
  communityImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: 8,
  },
  communityName: {
    fontSize: 16,
    fontFamily: "RobotoMedium",
    marginBottom: 8,
  },
  communityText: {
    fontSize: 12,
    fontFamily: "RobotoRegular",
    color: Colors.text.faint,
    paddingBottom: 8,
  },
  joinButtonText: {
    color: Colors.brand.secondary,
    fontFamily: "RobotoRegular",
    fontSize: 14,
  },
  postTitle: {
    fontSize: 14,
    fontFamily: "RobotoMedium",
    marginBottom: 10,
    color: Colors.ui.base,
  },
  profileCircle: {
    width: 23,
    height: 23,
    borderRadius: 20,
    marginRight: 6,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  author: {
    fontSize: 11,
    fontFamily: "RobotoRegular",
    color: Colors.text.faint,
    flexShrink: 1,
    flexGrow: 1,
    overflow: "hidden",
  },
});

export default styles;
