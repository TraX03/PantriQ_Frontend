import React from "react";
//prettier-ignore
import { View, TextInput, TextInputProps, StyleProp, ViewStyle } from "react-native";
import { IconSymbol, IconSymbolName } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";

type Props = TextInputProps & {
  icon: IconSymbolName;
  iconColor?: string;
  iconSize?: number;
  containerStyle?: StyleProp<ViewStyle>;
  isPassword?: boolean;
  className?: string;
};

export default function InputBox({
  icon,
  iconColor = Colors.brand.main,
  iconSize = 20,
  containerStyle,
  style,
  isPassword = false,
  className = "mb-2",
  ...props
}: Props) {
  return (
    <View
      className={`flex-row items-center px-4 py-2 rounded-xl border-2 ${className}`}
      style={[
        {
          backgroundColor: Colors.brand.accent,
          borderColor: Colors.brand.main,
        },
        containerStyle,
      ]}
    >
      <IconSymbol
        name={icon}
        size={iconSize}
        color={iconColor}
        style={{ marginRight: 8 }}
      />
      <TextInput
        {...props}
        className="flex-1"
        placeholderTextColor={Colors.text.placeholder}
        secureTextEntry={isPassword || props.secureTextEntry}
        numberOfLines={1}
        maxLength={200}
        style={style}
      />
    </View>
  );
}
