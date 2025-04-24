import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";

const MAPPING = {
  house: { name: "home-outline", type: "Ionicons" },
  "house.fill": { name: "home-sharp", type: "Ionicons" },
  "calendar.circle": { name: "calendar-outline", type: "Ionicons" },
  "calendar.circle.fill": { name: "calendar-sharp", type: "Ionicons" },
  "list.bullet": { name: ["list-outline", "list-sharp"], type: "Ionicons" },
  person: { name: "person-outline", type: "Ionicons" },
  "person.fill": { name: "person-sharp", type: "Ionicons" },
  magnifyingglass: { name: "search", type: "Ionicons" },
  bell: { name: "notifications", type: "Ionicons" },
  heart: { name: "heart-outline", type: "Ionicons" },
  "heart.fill": { name: "heart-sharp", type: "Ionicons" },
  bookmark: { name: "bookmark-outline", type: "Ionicons" },
  "bookmark.fill": { name: "bookmark-sharp", type: "Ionicons" },
  "chevron.left": { name: "chevron-back", type: "Ionicons" },
  "lock.fill": { name: "password", type: "MaterialIcons" },
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
}) {
  const mapping = MAPPING[name];

  if (!mapping) {
    console.warn(`Icon mapping for "${name}" not found.`);
    return null;
  }

  const { name: iconName, type } = mapping;

  const finalIconName = Array.isArray(iconName)
    ? iconName[selectedIcon]
    : iconName;

  const IconComponent =
    type === "MaterialIcons"
      ? MaterialIcons
      : type === "Ionicons"
      ? Ionicons
      : null;

  if (!IconComponent) {
    console.warn(`Icon type "${type}" is not supported.`);
    return null;
  }

  return (
    <IconComponent
      name={finalIconName}
      color={color}
      size={size}
      style={style}
    />
  );
}
