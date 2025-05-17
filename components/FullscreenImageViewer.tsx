import React from "react";
import { Modal, TouchableOpacity, Image } from "react-native";
import styles from "./styles";

type FullscreenImageViewerProps = {
  imageUri: string | null;
  onClose: () => void;
};

export default function FullscreenImageViewer({
  imageUri,
  onClose,
}: FullscreenImageViewerProps) {
  if (!imageUri) return null;

  return (
    <Modal visible transparent statusBarTranslucent>
      <TouchableOpacity style={styles.modalContainer} onPress={onClose}>
        <Image
          source={{ uri: imageUri }}
          style={styles.fullImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Modal>
  );
}
