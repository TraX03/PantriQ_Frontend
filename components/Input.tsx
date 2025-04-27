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

export default function Input({
  icon,
  iconColor = Colors.brand.primary,
  iconSize = 20,
  containerStyle,
  style,
  isPassword,
  className = "mb-1.5",
  ...props
}: Props) {
  return (
    <View
      className={`flex-row items-center px-4 rounded-xl border-2 ${
        className ?? ""
      }`}
      style={[
        {
          backgroundColor: Colors.brand.secondary,
          borderColor: Colors.brand.primary,
        },
        containerStyle,
      ]}
    >
      {icon && (
        <IconSymbol
          name={icon}
          size={iconSize}
          color={iconColor}
          style={{ marginRight: 8 }}
        />
      )}
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
};
