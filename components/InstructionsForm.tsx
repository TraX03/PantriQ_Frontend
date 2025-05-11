import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Modal } from "react-native";
import { styles as createStyles } from "@/utility/create/styles";
import { Colors } from "@/constants/Colors";
import { styles as profileStyles } from "@/utility/profile/styles";
import InputBox from "./InputBox";
import { IconSymbol } from "./ui/IconSymbol";
import styles from "./styles";

type Props = {
  instructions: { image?: string; text: string }[];
  modifyInstruction: (action: "add" | "remove", index?: number) => void;
  updateInstruction: (index: number, text: string) => void;
  updateInstructionImage: (index: number, shouldRemove?: boolean) => void;
};

export default function InstructionsForm({
  instructions,
  modifyInstruction,
  updateInstruction,
  updateInstructionImage,
}: Props) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  return (
    <>
      <Modal visible={!!fullscreenImage} transparent>
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => setFullscreenImage(null)}
        >
          <Image
            source={{ uri: fullscreenImage! }}
            style={{ width: "100%", height: "100%", resizeMode: "contain" }}
          />
        </TouchableOpacity>
      </Modal>

      <View className="mt-4 space-y-4">
        <Text style={createStyles.inputTitle}>Instructions</Text>
        {instructions.map((step, index) => (
          <View key={index} className="mb-4">
            <View className="flex-row justify-between items-center">
              <Text style={createStyles.stepText}>Step {index + 1}</Text>
              {index != 0 && (
                <TouchableOpacity
                  onPress={() => {
                    modifyInstruction("remove", index);
                  }}
                  className="items-end"
                >
                  <Text style={createStyles.linkText}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>

            {step.image ? (
              <View className="mb-2 relative">
                <Image
                  source={{ uri: step.image }}
                  className="w-full h-40 rounded"
                  resizeMode="cover"
                />

                <TouchableOpacity
                  className="absolute top-3 right-3 p-1 rounded-full"
                  style={{ backgroundColor: Colors.ui.overlayLight }}
                  onPress={() => setFullscreenImage(step.image!)}
                >
                  <IconSymbol
                    name="arrow.up.left.and.arrow.down.right"
                    size={25}
                    color={Colors.brand.base}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  className="absolute top-3 right-14 p-1 rounded-full"
                  style={{ backgroundColor: Colors.ui.overlayLight }}
                  onPress={() => updateInstructionImage(index, true)}
                >
                  <IconSymbol
                    name="trash"
                    size={25}
                    color={Colors.brand.base}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                className="w-full h-40 justify-center items-center rounded mb-2"
                style={{ backgroundColor: Colors.ui.grayButtonFill }}
                onPress={() => {
                  updateInstructionImage(index);
                }}
              >
                <Text>Add Image (Optional)</Text>
              </TouchableOpacity>
            )}

            <InputBox
              placeholder={"Describe this step"}
              value={step.text}
              onChangeText={(text) => updateInstruction(index, text)}
              inputStyle={profileStyles.input}
              isMultiline
            />
          </View>
        ))}

        <TouchableOpacity
          onPress={() => modifyInstruction("add")}
          style={createStyles.addStepButton}
        >
          <Text style={createStyles.stepButtonText}>Add Step</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
