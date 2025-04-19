import {
  MaterialIcons,
  Entypo,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import React from "react";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";

type IconLibraries = "MaterialIcons" | "Entypo" | "Ionicons" | "FontAwesome5";

type IconProps = {
  library: IconLibraries;
  name: string;
  size?: number;
  color?: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
};

const iconMap = {
  MaterialIcons,
  Entypo,
  Ionicons,
  FontAwesome5,
};

export const IconSymbol = ({
  library,
  name,
  size = 24,
  color,
  style,
}: IconProps) => {
  const IconComponent = iconMap[library];

  // Handle case where the provided icon library is not found in iconMap
  if (!IconComponent) {
    console.warn(`Invalid icon library: ${library}`);
    return null;
  }

  return (
    <IconComponent name={name as any} size={size} color={color} style={style} />
  );
};
