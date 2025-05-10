import { Colors } from "@/constants/Colors";
import React from "react";
import { Modal, Text, Pressable, Image } from "react-native";
import styles from "./styles";

interface NotificationModalProps {
  visible: boolean;
  errorTitle: string;
  errorMessage: string;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  errorTitle,
  errorMessage,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <Pressable
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: Colors.ui.overlay }}
        onPress={onClose}
      >
        <Pressable
          onPress={() => {}}
          className="rounded-2xl p-6 w-80 shadow-lg"
          style={{ backgroundColor: Colors.brand.accent }}
        >
          <Image
            source={require("@/assets/images/error-icon.png")}
            className="w-full h-[100px] self-center my-6"
            resizeMode="contain"
          />
          <Text className="mb-2 mt-3" style={styles.errorTitle}>
            {errorTitle}
          </Text>
          <Text className="mb-6" style={styles.errorDescription}>
            {errorMessage}
          </Text>

          <Pressable
            onPress={onClose}
            className="mt-4 self-end px-7 py-2 rounded-full"
            style={{ backgroundColor: Colors.ui.buttonFill }}
          >
            <Text style={styles.buttonText}>OK</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default NotificationModal;
