import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { Stack } from "expo-router";
import { styles as profileStyles } from "@/utility/profile/styles";
import { styles } from "@/utility/create/styles";
import { useFieldState } from "@/hooks/useFieldState";
import HeaderBar from "@/components/HeaderBar";
import InputBox from "@/components/InputBox";
import IngredientsForm from "@/components/IngredientsForm";
import PostTypeSelector from "@/components/PostTypeSelector";
import { CreateFormState } from "./controller";
import InstructionsForm from "@/components/InstructionsForm";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";

type Props = {
  create: ReturnType<typeof useFieldState<CreateFormState>>;
  controller: {
    handlePickImage: () => void;
    handleSubmit: () => void;
    updateIngredient: (
      index: number,
      field: "name" | "quantity",
      value: string
    ) => void;
    modifyIngredient: (action: "add" | "remove", index?: number) => void;
    selectSuggestion: (index: number, suggestion: string) => void;
    updateInstruction: (index: number, text: string) => void;
    updateInstructionImage: (index: number) => void;
    modifyInstruction: (action: "add" | "remove", index?: number) => void;
    isFormValid: string | boolean;
  };
};

export default function CreateFormComponent({ create, controller }: Props) {
  const { setFieldState } = create;
  const { title, content, images, postType } = create;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setFieldState("focusedIndex", null);
        }}
        accessible={false}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={profileStyles.headerContainer}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <HeaderBar
            title={
              postType === "recipe"
                ? "Create New Recipe"
                : postType === "community"
                ? "Create New Community"
                : "Create New Post"
            }
          />

          <View className="px-4 py-2">
            <Text style={styles.inputTitle}>Image</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row items-center mb-7 pt-2.5">
                {images.map((uri, index) => (
                  <View key={index} className="relative mr-3">
                    <Image
                      source={{ uri }}
                      className="w-32 h-32 rounded"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() => {
                        const updatedImages = images.filter(
                          (_, i) => i !== index
                        );
                        setFieldState("images", updatedImages);
                      }}
                      style={styles.removeButton}
                    >
                      <IconSymbol
                        name="multiply.circle"
                        color={Colors.brand.light}
                        size={24}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
                {(postType !== "community" && images.length < 5) ||
                (postType === "community" && images.length === 0) ? (
                  <TouchableOpacity
                    onPress={controller.handlePickImage}
                    className="w-32 h-32 rounded items-center justify-center mr-3"
                    style={styles.addImageButton}
                  >
                    <IconSymbol
                      name="plus"
                      color={Colors.ui.overlay}
                      size={30}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            </ScrollView>

            {postType === "recipe" && (
              <IngredientsForm create={create} controller={controller} />
            )}

            {(postType === "tips" || postType === "discussion") && (
              <PostTypeSelector
                postType={postType}
                setPostType={(type) => setFieldState("postType", type)}
              />
            )}

            <Text style={styles.inputTitle}>
              {postType === "community" ? "Community Name" : "Title"}
            </Text>
            <InputBox
              placeholder={
                postType === "community"
                  ? "Enter community name"
                  : "Enter post title"
              }
              value={title}
              onChangeText={(text) => setFieldState("title", text)}
              inputStyle={profileStyles.input}
              limit={50}
              isMultiline
            />

            <Text style={styles.inputTitle}>
              {postType === "community" || postType === "recipe"
                ? "Description"
                : "Content"}
            </Text>
            <InputBox
              placeholder={
                postType === "community"
                  ? "Briefly introduce your community"
                  : postType === "recipe"
                  ? "Add a short description of your recipe"
                  : "Share your thoughts or ask a question"
              }
              value={content}
              onChangeText={(text) => setFieldState("content", text)}
              inputStyle={profileStyles.input}
              limit={
                postType === "community" || postType === "recipe" ? 160 : 2000
              }
              isMultiline
            />

            {postType === "recipe" && (
              <InstructionsForm
                instructions={create.instructions}
                modifyInstruction={controller.modifyInstruction}
                updateInstruction={controller.updateInstruction}
                updateInstructionImage={controller.updateInstructionImage}
              />
            )}

            <TouchableOpacity
              style={[
                profileStyles.saveButton,
                { opacity: controller.isFormValid ? 1 : 0.5 },
              ]}
              onPress={controller.handleSubmit}
              disabled={!controller.isFormValid}
            >
              <Text style={profileStyles.saveButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </>
  );
}
