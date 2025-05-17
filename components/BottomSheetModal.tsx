import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
  StyleProp,
} from "react-native";
import { useSlide } from "@/hooks/useSlide";
import { router } from "expo-router";
import styles from "./styles";

type Option = {
  key: string;
  label: string;
  onPress: () => void;
};

type BottomSheetModalProps = {
  isVisible: boolean;
  onClose: () => void;
  options: Option[];
  zIndex?: number;
  modalStyle?: StyleProp<ViewStyle>;
};

export default function BottomSheetModal({
  isVisible,
  onClose,
  options,
  zIndex = 0,
  modalStyle,
}: BottomSheetModalProps) {
  const { translateY, shouldRender } = useSlide(isVisible);

  if (!shouldRender) return null;

  return (
    <View
      style={[
        StyleSheet.absoluteFillObject,
        { zIndex, justifyContent: "flex-end" },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={StyleSheet.absoluteFillObject}
      />
      <Animated.View
        style={[
          styles.SlideModalSheet,
          { transform: [{ translateY }] },
          modalStyle,
        ]}
      >
        {options.map(({ key, label, onPress }) => (
          <TouchableOpacity key={key} className="py-1" onPress={onPress}>
            <Animated.Text style={styles.addModalText}>{label}</Animated.Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
}
