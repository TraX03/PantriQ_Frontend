import React from "react";
import { Modal, View } from "react-native";
import { styles } from "@/utility/profile/styles";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function LoadingScreen() {
  const loading = useSelector((state: RootState) => state.loading.loading);

  return (
    <Modal
      visible={loading}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.centeredContainer}>
        <Image
          source={require("@/assets/animations/fancy-loading.gif")}
          style={{ width: 240, height: 240 }}
        />
      </View>
    </Modal>
  );
}