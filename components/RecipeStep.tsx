import { Instruction } from "@/app/create/createForm/controller";
import { Colors } from "@/constants/Colors";
import { getImageUrl } from "@/utility/imageUtils";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import FullscreenImageViewer from "./FullscreenImageViewer";
import styles from "./styles";
import { IconSymbol } from "./ui/IconSymbol";

interface RecipeStepProps {
  index: number;
  step: Instruction;
}

export const RecipeStep: React.FC<RecipeStepProps> = ({ index, step }) => {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Capitalize first letter and ensure the instruction ends with punctuation
  const formatInstruction = (text: string) => {
    if (!text) return "";
    const capitalized = text.charAt(0).toUpperCase() + text.slice(1);
    return /[.!?]$/.test(text) ? capitalized : capitalized + ".";
  };

  const finalText = formatInstruction(step.text || "");
  const imageUri = step.image ? getImageUrl(step.image) : null;

  return (
    <>
      <FullscreenImageViewer
        imageUri={fullscreenImage}
        onClose={() => setFullscreenImage(null)}
      />
      <View className="mb-7">
        <Text style={styles.stepText}>STEP {index + 1}</Text>

        {imageUri && (
          <View className="mb-2 relative">
            <Image
              source={{ uri: imageUri }}
              style={styles.stepImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              className="absolute top-3 right-3 p-1 rounded-full"
              style={{ backgroundColor: Colors.ui.overlayLight }}
              onPress={() => setFullscreenImage(imageUri)}
            >
              <IconSymbol
                name="arrow.up.left.and.arrow.down.right"
                size={25}
                color={Colors.brand.base}
              />
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.stepDescription}>{finalText}</Text>
      </View>
    </>
  );
};
