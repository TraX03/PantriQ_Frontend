import React from "react";
//prettier-ignore
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useSlide } from "@/hooks/useSlide";
import styles from "./styles";
import { router } from "expo-router";

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

export default function AddModal({ isVisible, onClose }: Props) {
  const { translateY, shouldRender } = useSlide(isVisible);

  if (!shouldRender) return null;

  return (
    <View className="absolute inset-0 z-0 justify-end">
      <TouchableOpacity
        style={{ ...StyleSheet.absoluteFillObject }}
        activeOpacity={1}
        onPress={onClose}
      />
      <Animated.View
        style={[styles.addModalSheet, { transform: [{ translateY }] }]}
      >
        <TouchableOpacity className="py-1" onPress={onClose}>
          <Text style={styles.addModalText}>Create new recipe</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="py-1"
          onPress={() => {
            onClose();
            router.push("/create/createForm/container");
          }}
        >
          <Text style={styles.addModalText}>Create new post</Text>
        </TouchableOpacity>
        <TouchableOpacity className="py-1" onPress={onClose}>
          <Text style={styles.addModalText}>Create new community</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
