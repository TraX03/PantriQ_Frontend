import { Colors } from "@/constants/Colors";
import { useSlide } from "@/hooks/useSlide";
import React, { useEffect, useState } from "react";
import {
  Animated,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import styles from "./styles";

type Option = {
  key: string;
  label: string;
  onPress: () => void;
};

type BottomSheetModalProps = {
  isVisible: boolean;
  onClose: () => void;
  options?: Option[];
  zIndex?: number;
  modalStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

export default function BottomSheetModal({
  isVisible,
  onClose,
  options,
  zIndex = 0,
  modalStyle,
  children,
}: BottomSheetModalProps) {
  const { translateY, shouldRender } = useSlide(isVisible);
  const [overlayColor, setOverlayColor] = useState(Colors.ui.overlay);

  useEffect(() => {
    if (isVisible) {
      setOverlayColor(Colors.ui.overlay);
    }
  }, [isVisible]);

  const handlePress = () => {
    setOverlayColor("transparent");
    onClose();
  };

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
        onPress={handlePress}
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: overlayColor },
        ]}
      />
      <Animated.View
        style={[
          styles.slideModalSheet,
          { transform: [{ translateY }] },
          modalStyle,
        ]}
      >
        <View style={styles.divider} />
        {children ??
          options?.map(({ key, label, onPress }) => (
            <TouchableOpacity key={key} className="py-1" onPress={onPress}>
              <Animated.Text style={styles.addModalText}>{label}</Animated.Text>
            </TouchableOpacity>
          ))}
      </Animated.View>
    </View>
  );
}
