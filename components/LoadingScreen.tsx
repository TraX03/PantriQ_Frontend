import React from "react";
import { Modal, View } from "react-native";
import { styles } from "@/utility/profile/styles";
import { Image } from "expo-image";
import { useLoading } from "@/context/LoadingContext";

export default function LoadingScreen() {
  const { loading } = useLoading();

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
          style={{ width: 280, height: 280 }}
        />
      </View>
    </Modal>
  );
}
