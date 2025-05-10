import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Stack } from "expo-router";
import { styles as profileStyles } from "@/utility/profile/styles";
import { styles as editStyles } from "@/utility/profile/styles";
import { styles } from "@/utility/create/styles";
import { useFieldState } from "@/hooks/useFieldState";
import HeaderBar from "@/components/HeaderBar";
import InputBox from "@/components/InputBox";
import ImageUploader from "@/components/ImageUploader";
import IngredientsForm from "@/components/IngredientsForm";
import PostTypeSelector from "@/components/PostTypeSelector";
import { CreateFormState } from "./controller";

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
    addIngredient: () => void;
    removeIngredient: (index: number) => void;
    selectSuggestion: (index: number, suggestion: string) => void;
  };
};

export default function CreateFormComponent({ create, controller }: Props) {
  const { setFieldState } = create;
  const { title, content, images, postType, ingredients } = create;

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
          style={profileStyles.headerContainer}
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
            <ImageUploader
              images={images}
              onPickImage={controller.handlePickImage}
            />

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

            <TouchableOpacity
              style={[
                editStyles.saveButton,
                {
                  opacity:
                    !title ||
                    !content ||
                    (postType === "recipe" && ingredients.length === 0)
                      ? 0.8
                      : 1,
                },
              ]}
              onPress={controller.handleSubmit}
              disabled={
                !title ||
                !content ||
                (postType === "recipe" && ingredients.length === 0)
              }
            >
              <Text style={editStyles.saveButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </>
  );
}
