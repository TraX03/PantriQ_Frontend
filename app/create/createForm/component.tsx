import EntryListForm from "@/components/EntryListForm";
import HeaderBar from "@/components/HeaderBar";
import InputBox from "@/components/InputBox";
import InstructionsForm from "@/components/InstructionsForm";
import PostTypeSelector from "@/components/PostTypeSelector";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useFieldState } from "@/hooks/useFieldState";
import { styles } from "@/utility/create/styles";
import { styles as profileStyles } from "@/utility/profile/styles";
import { Stack } from "expo-router";
import React from "react";
import {
  Image,
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { CreateFormState } from "./controller";

export type EntryController = {
  updateEntry: (
    type: keyof CreateFormState,
    index: number,
    field: "name" | "quantity",
    value: string
  ) => void;
  modifyEntry: (
    type: keyof CreateFormState,
    action: "add" | "remove",
    index?: number
  ) => void;
  selectSuggestion: (
    type: keyof CreateFormState,
    index: number,
    suggestion: string
  ) => void;
};

type Props = {
  create: ReturnType<typeof useFieldState<CreateFormState>>;
  controller: EntryController & {
    handlePickImage: () => void;
    handleSubmit: () => void;
    updateInstruction: (index: number, text: string) => void;
    updateInstructionImage: (index: number) => void;
    modifyInstruction: (action: "add" | "remove", index?: number) => void;
    isFormValid: string | boolean;
  };
};

export default function CreateFormComponent({ create, controller }: Props) {
  const { setFieldState, title, content, images, postType } = create;

  const isRecipe = postType === "recipe";
  const isCommunity = postType === "community";
  const isTipsOrDiscussion = postType === "tips" || postType === "discussion";

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenWrapper>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            setFieldState("focusedIndex", {
              ingredient: null,
              category: null,
              area: null,
            });
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
                isRecipe
                  ? "Create New Recipe"
                  : isCommunity
                  ? "Create New Community"
                  : "Create New Post"
              }
            />

            <View className="px-4 py-2">
              <Text style={styles.inputTitle}>Image</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row items-center mb-7 pt-2.5">
                  {images.map((uri, index) => (
                    <View key={index} className="relative mr-4">
                      <Image
                        source={{ uri }}
                        className="w-32 h-32 rounded"
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        onPress={() =>
                          setFieldState(
                            "images",
                            images.filter((_, i) => i !== index)
                          )
                        }
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
                  {((!isCommunity && images.length < 5) ||
                    (isCommunity && images.length === 0)) && (
                    <TouchableOpacity
                      onPress={controller.handlePickImage}
                      style={styles.addImageButton}
                    >
                      <IconSymbol
                        name="plus"
                        color={Colors.ui.overlay}
                        size={30}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>

              {isRecipe && (
                <View className="mb-4">
                  <EntryListForm
                    type="ingredient"
                    create={create}
                    controller={controller}
                    placeholder="Ingredient"
                    label="Ingredients"
                  />
                  <EntryListForm
                    type="category"
                    create={create}
                    controller={controller}
                    placeholder="Category"
                  />
                  <EntryListForm
                    type="area"
                    create={create}
                    controller={controller}
                    placeholder="e.g. Italian, Japanese"
                  />
                </View>
              )}

              {isTipsOrDiscussion && (
                <PostTypeSelector
                  postType={postType}
                  setPostType={(type) => setFieldState("postType", type)}
                />
              )}

              <Text style={styles.inputTitle}>
                {isCommunity ? "Community Name" : "Title"}
              </Text>
              <InputBox
                placeholder={
                  isCommunity ? "Enter community name" : "Enter post title"
                }
                value={title}
                onChangeText={(text) => setFieldState("title", text)}
                inputStyle={profileStyles.input}
                limit={50}
                isMultiline
              />

              <Text style={styles.inputTitle}>
                {isCommunity || isRecipe ? "Description" : "Content"}
              </Text>
              <InputBox
                placeholder={
                  isCommunity
                    ? "Briefly introduce your community"
                    : isRecipe
                    ? "Add a short description of your recipe"
                    : "Share your thoughts or ask a question"
                }
                value={content}
                onChangeText={(text) => setFieldState("content", text)}
                inputStyle={profileStyles.input}
                limit={isCommunity || isRecipe ? 160 : 2000}
                isMultiline
              />

              {isRecipe && (
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
      </ScreenWrapper>
    </>
  );
}
