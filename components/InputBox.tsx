import React from "react";
import {
  View,
  TextInput,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  Text,
  TextStyle,
} from "react-native";
import { IconSymbol, IconSymbolName } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { styles as profileStyles } from "@/utility/profile/styles";

type Props = TextInputProps & {
  icon?: IconSymbolName;
  iconColor?: string;
  iconSize?: number;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  isPassword?: boolean;
  limit?: number;
  isMultiline?: boolean;
  lines?: number;
  value: string;
  onChangeText: (text: string) => void;
};

export default function InputBox({
  icon,
  iconColor = Colors.brand.main,
  iconSize = 20,
  containerStyle,
  inputStyle,
  isPassword = false,
  limit,
  isMultiline = false,
  lines,
  value,
  onChangeText,
  ...props
}: Props) {
  return (
    <>
      <View style={containerStyle} className="relative">
        {!!icon && (
          <IconSymbol
            name={icon}
            size={iconSize}
            color={iconColor}
            style={{ marginRight: 8 }}
          />
        )}

        <TextInput
          {...props}
          value={value}
          onChangeText={onChangeText}
          className={containerStyle ? "flex-1 pr-8" : undefined}
          secureTextEntry={isPassword || props.secureTextEntry}
          multiline={isMultiline}
          numberOfLines={lines}
          maxLength={limit}
          style={inputStyle}
        />

        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => onChangeText("")}
            className={
              containerStyle
                ? "absolute right-5 top-3"
                : "absolute right-5 top-1/2 transform -translate-y-1/2 self-center"
            }
          >
            <IconSymbol
              name="multiply.circle"
              color={Colors.ui.overlay}
              size={18}
            />
          </TouchableOpacity>
        )}
      </View>

      {limit && (
        <Text style={profileStyles.indicatorText}>
          {value.length}/{limit} characters
        </Text>
      )}
    </>
  );
}
