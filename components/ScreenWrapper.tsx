import React from "react";
import { View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenWrapperProps extends ViewProps {
  children: React.ReactNode;
}

export const ScreenWrapper = ({
  children,
  style,
  ...rest
}: ScreenWrapperProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[{ flex: 1, paddingBottom: insets.bottom }, style]} {...rest}>
      {children}
    </View>
  );
};
