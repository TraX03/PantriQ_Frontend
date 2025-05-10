import React from "react";
import { View, ScrollView, TouchableOpacity, Image, Text } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { styles } from "@/utility/create/styles";

type Props = {
  images: string[];
  onPickImage: () => void;
};

export default function ImageUploader({ images, onPickImage }: Props) {
  return (
    <>
      <Text style={styles.inputTitle}>Image</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row items-center mb-7">
          {images.map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
              className="w-32 h-32 rounded mr-3"
              resizeMode="cover"
            />
          ))}
          {images.length < 5 && (
            <TouchableOpacity
              onPress={onPickImage}
              className="w-32 h-32 rounded items-center justify-center mr-3"
              style={styles.addImageButton}
            >
              <IconSymbol name="plus" color={Colors.text.secondary} size={30} />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </>
  );
}
