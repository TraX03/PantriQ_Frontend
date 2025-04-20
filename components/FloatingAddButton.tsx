import React, { useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Image, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { Colors } from "@/constants/Colors";

const imageSource = require("@/assets/images/add-button.png");

const FloatingActionButton: React.FC<TouchableOpacityProps> = (props) => {
  const { width, height } = Image.resolveAssetSource(imageSource);
  const aspectRatio = useMemo(() => width / height, [width, height]);

  return (
    <TouchableOpacity
      className="absolute bottom-7 z-10 self-center"
      activeOpacity={0.8}
      {...props}
    >
      <View className="overflow-hidden rounded-xl">
        {/* <LinearGradient
          colors={["transparent", Colors.background]}
          className="p-1"
        > */}
          <Image
            source={imageSource}
            style={{ height: 60, aspectRatio }}
            resizeMode="contain"
          />
        {/* </LinearGradient> */}
      </View>
    </TouchableOpacity>
  );
};

export default FloatingActionButton;
