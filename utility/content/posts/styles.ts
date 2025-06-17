import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: Colors.brand.onPrimary,
  },
  contentContainer: {
    backgroundColor: Colors.brand.onPrimary,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  overlayContainer: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 25,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  commentBar: {
    flex: 1,
    marginRight: 10,
    backgroundColor: Colors.surface.backgroundSoft,
    borderRadius: 50,
  },
  timeAgoText: {
    fontSize: 10,
    color: Colors.text.disabled,
  },
  commentText: {
    marginTop: 5,
    fontSize: 13,
    color: Colors.text.primary,
  },
  divider: {
    width: 200,
    height: 0.5,
    backgroundColor: Colors.surface.border,
    alignSelf: "center",
    marginVertical: 25,
  },

  // Modals & Panels
  postSettings: {
    width: "100%",
    borderRadius: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 20,
    paddingBottom: 80,
    marginBottom: -30,
    elevation: 8,
  },
  instructionModal: {
    height: "85%",
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 90,
    marginBottom: -25,
  },

  // Text styles
  modalHeader: {
    fontSize: 20,
    fontFamily: "RobotoSemiBold",
    marginBottom: 12,
    textAlign: "center",
  },
  recipeTitle: {
    fontSize: 20,
    fontFamily: "RobotoBold",
    flexShrink: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "RobotoMedium",
  },
  authorText: {
    color: Colors.text.disabled,
    marginTop: 6,
    fontFamily: "RobotoMedium",
    fontSize: 14,
  },
  authorName: {
    color: Colors.brand.primary,
    textDecorationLine: "underline",
  },
  statsText: {
    color: Colors.text.disabled,
    fontSize: 12,
    marginTop: 4,
  },
  ingredientName: {
    color: Colors.text.primary,
    fontSize: 15,
    fontFamily: "RobotoRegular",
    flexShrink: 1,
  },
  quantityName: {
    color: Colors.text.disabled,
    fontSize: 14,
    fontFamily: "RobotoRegular",
  },
  buttonText: {
    color: Colors.brand.primary,
    fontFamily: "RobotoMedium",
    fontSize: 15,
    textDecorationLine: "underline",
  },
  nutrientLabel: {
    fontSize: 18,
    fontFamily: "RobotoMedium",
    color: Colors.brand.primary,
  },
  nutrientContainer: {
    width: "100%",
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: Colors.overlay.ultraLightGray,
  },
  header: {
    fontFamily: "RobotoSemiBold",
    fontSize: 20,
  },
  subHeader: {
    fontFamily: "RobotoSemiBold",
    fontSize: 16,
    marginBottom: 10,
    color: Colors.text.primary,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderColor: Colors.surface.buttonSecondary,
  },
  itemLabel: {
    fontSize: 14,
    color: Colors.text.light,
    fontFamily: "RobotoRegular",
  },
  amount: {
    fontSize: 14,
    color: Colors.brand.onBackground,
    fontFamily: "RobotoMedium",
  },
  content: {
    fontFamily: "RobotoRegular",
    fontSize: 14,
    lineHeight: 20,
  },
  dateText: {
    alignSelf: "flex-end",
    color: Colors.text.disabled,
    fontSize: 12,
    paddingTop: 10,
  },
  countLabel: {
    fontSize: 10,
    color: Colors.text.disabled,
  },
});
