import React from "react";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";

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
  "pencil.and.outline": { name: "edit-3", type: "Feather" },
  ellipsis: { name: "settings-outline", type: "Ionicons" },
  "chevron.right": { name: "chevron-forward", type: "Ionicons" },
  photo: { name: "image-outline", type: "Ionicons" },
} as const;

export type IconSymbolName = keyof typeof MAPPING;

interface IconSymbolProps {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  selectedIcon?: number;
}

export function IconSymbol({
  name,
  size = 25,
  color,
  style,
  selectedIcon = 0,
}: IconSymbolProps) {
  const mapping = MAPPING[name];

  if (!mapping) {
    console.warn(`Icon mapping for "${name}" not found.`);
    return null;
  }

  const { name: iconName, type } = mapping;
  const iconComponentMap = {
    Ionicons: Ionicons,
    MaterialIcons: MaterialIcons,
    Feather: Feather,
  };

  const IconComponent = iconComponentMap[type];

  if (!IconComponent) {
    console.warn(`Icon type "${type}" is not supported.`);
    return null;
  }

  const finalIconName = Array.isArray(iconName)
    ? iconName[selectedIcon]
    : iconName;

  return (
    <IconComponent
      name={finalIconName}
      color={color}
      size={size}
      style={style}
    />
  );
}
