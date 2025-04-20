import Ionicons from "@expo/vector-icons/Ionicons";
import { SymbolWeight } from "expo-symbols";
import React from "react";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";

const MAPPING = {
  "house": "home-outline",
  "house.fill": "home-sharp",
  "calendar.circle": "calendar-outline",
  "calendar.circle.fill": "calendar-sharp",
  "list.bullet": ["list-outline", "list-sharp"],
  "person": "person-outline",
  "person.fill": "person-sharp",
} as const;

export type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 25,
  color,
  style,
  selectedIcon = 0,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  selectedIcon?: number;
  weight?: SymbolWeight;
}) {
  const iconName = MAPPING[name];

  if (!iconName) {
    console.warn(`Icon mapping for "${name}" not found.`);
    return null;
  }

  const finalIconName = Array.isArray(iconName)
    ? iconName[selectedIcon]
    : iconName;

  return (
    <Ionicons color={color} size={size} name={finalIconName} style={style} />
  );
}
