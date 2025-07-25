import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: "SignikaNegativeSCSemiBold",
    fontSize: 25,
    color: Colors.text.highlight,
  },
  weekContainer: {
    paddingVertical: 10,
    backgroundColor: Colors.brand.onPrimary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    elevation: 2,
    zIndex: 10,
  },
  weekText: {
    fontFamily: "RobotoMedium",
    fontSize: 17,
    color: Colors.text.primary,
  },
  dayText: {
    fontFamily: "RobotoRegular",
    fontSize: 14,
  },
  dateText: {
    fontFamily: "RobotoMedium",
    fontSize: 17,
    color: Colors.brand.onBackground,
    marginRight: 8,
    marginVertical: 4,
  },
  addMealButton: {
    width: 130,
    height: 100,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface.buttonSecondary,
  },
  mealtimeContainer: {
    backgroundColor: Colors.brand.onPrimary,
    width: "100%",
    padding: 13,
    borderRadius: 8,
    marginTop: 10,
  },
  mealtimeTitle: {
    fontFamily: "AfacadMedium",
    fontSize: 20,
    color: Colors.brand.primary,
  },
  recipeTitle: {
    color: Colors.brand.onBackground,
    fontFamily: "RobotoRegular",
    fontSize: 13,
  },
  addContianer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: Colors.overlay.base,
    borderBottomWidth: 1.5,
    marginHorizontal: 5,
    marginTop: 18,
    marginBottom: 12,
  },
  addText: {
    fontFamily: "AfacadMedium",
    fontSize: 20,
    color: Colors.overlay.base,
  },
  generateButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: Colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    paddingHorizontal: 4,
  },
  generateText: {
    color: Colors.brand.onPrimary,
    fontSize: 12,
    textAlign: "center",
    fontFamily: "RobotoRegular",
  },
  mealtimeModal: {
    paddingBottom: 50,
    marginBottom: -20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "RobotoMedium",
    marginVertical: 8,
  },
  counterContainer: {
    borderColor: Colors.surface.border,
    borderWidth: 1,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    height: 30,
    backgroundColor: Colors.brand.primary,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  contentContainer: {
    paddingBottom: 30,
    backgroundColor: Colors.surface.background,
    height: "100%",
  },
});
