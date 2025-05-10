import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { useSlide } from "@/hooks/useSlide";
import { router } from "expo-router";
import styles from "./styles";

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

const createOptions = [
  { type: "recipe", label: "Create new recipe" },
  { type: "tips", label: "Create new post" },
  { type: "community", label: "Create new community" },
] as const;

export default function AddModal({ isVisible, onClose }: Props) {
  const { translateY, shouldRender } = useSlide(isVisible);

  const navigateToCreate = (type: (typeof createOptions)[number]["type"]) => {
    onClose();
    router.push({
      pathname: "/create/[type]",
      params: { type },
    });
  };

  if (!shouldRender) return null;

  return (
    <View style={StyleSheet.absoluteFillObject} className="z-0 justify-end">
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={StyleSheet.absoluteFillObject}
      />
      <Animated.View
        style={[styles.addModalSheet, { transform: [{ translateY }] }]}
      >
        {createOptions.map(({ type, label }) => (
          <TouchableOpacity
            key={type}
            className="py-1"
            onPress={() => navigateToCreate(type)}
          >
            <Text style={styles.addModalText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
}
