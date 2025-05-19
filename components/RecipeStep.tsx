import { Colors } from "@/constants/Colors";
import { getImageUrl } from "@/utility/imageUtils";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import FullscreenImageViewer from "./FullscreenImageViewer";
import styles from "./styles";
import { IconSymbol } from "./ui/IconSymbol";

interface RecipeStepProps {
  index: number;
  step: string;
}

const RecipeStep: React.FC<RecipeStepProps> = ({ index, step }) => {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const [imageId, ...rest] = step.includes(" - ")
    ? step.split(" - ")
    : ["", step];
  const instructionText = rest.join(" - ").trim();

  const hasImage = imageId.trim().length > 10;
  const cleanedInstruction = instructionText
    .replace(/^step\s*\d+[\.\-\:\)]*\s*/i, "")
    .trim();
  const finalText =
    cleanedInstruction.charAt(0).toUpperCase() +
    cleanedInstruction.slice(1) +
    (/[.!?]$/.test(cleanedInstruction) ? "" : ".");

  return (
    <>
      <FullscreenImageViewer
        imageUri={fullscreenImage}
        onClose={() => setFullscreenImage(null)}
      />

      <View className="mb-7">
        <Text style={styles.stepText}>STEP {index + 1}</Text>

        {hasImage && (
          <View className="mb-2 relative">
            <Image
              source={{ uri: getImageUrl(imageId.trim()) }}
              style={styles.stepImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              className="absolute top-3 right-3 p-1 rounded-full"
              style={{ backgroundColor: Colors.ui.overlayLight }}
              onPress={() => setFullscreenImage(getImageUrl(imageId.trim()))}
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

export default RecipeStep;
