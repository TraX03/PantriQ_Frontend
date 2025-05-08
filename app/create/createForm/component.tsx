import React from "react";
//prettier-ignore
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { router, Stack } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { styles as profileStyles } from "@/utility/profile/styles";
import { styles as editStyles } from "@/utility/profile/styles";
import { styles } from "@/utility/create/styles";
import { useFieldState } from "@/hooks/useFieldState";

export interface CreateFormState {
  title: string;
  content: string;
  images: string[];
  postType: "discussion" | "tips";
}

type Props = {
  create: ReturnType<typeof useFieldState<CreateFormState>>;
  handlePickImage: () => void;
  handleSubmit: () => void;
};

export default function CreateFormComponent({
  create,
  handlePickImage,
  handleSubmit,
}: Props) {
  const { title, content, images, postType, setFieldState } = create;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={profileStyles.headerContainer}>
        <View className="flex-row items-center px-4 py-3">
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol
              name="chevron.left"
              color={Colors.brand.dark}
              size={30}
            />
          </TouchableOpacity>
          <Text style={profileStyles.headerTitle}>Create New Post</Text>
        </View>
        <View className="px-4 py-2">
          <Text style={styles.inputTitle}>Image</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
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
                  onPress={handlePickImage}
                  className="w-32 h-32 rounded items-center justify-center mr-3"
                  style={{
                    backgroundColor: Colors.ui.border,
                    opacity: 0.3,
                    elevation: 2,
                  }}
                >
                  <IconSymbol
                    name="plus"
                    color={Colors.text.secondary}
                    size={30}
                  />
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>

          <Text style={styles.inputTitle}>Post Type</Text>
          <View className="flex-row mb-4 gap-3">
            {["discussion", "tips"].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() =>
                  setFieldState("postType", type as "discussion" | "tips")
                }
                className={`flex-row items-center px-4 py-2 rounded-full border`}
                style={{
                  borderColor:
                    postType === type
                      ? Colors.brand.main
                      : Colors.text.placeholder,
                }}
              >
                <View
                  className="w-5 h-5 rounded-full border items-center justify-center mr-2"
                  style={{
                    borderColor:
                      postType === type
                        ? Colors.brand.main
                        : Colors.text.placeholder,
                  }}
                >
                  {postType === type && (
                    <View style={profileStyles.radioButtom} />
                  )}
                </View>

                <Text className="capitalize">
                  {type === "tips" ? "Tips & Advice" : type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.inputTitle}>Title</Text>
          <TextInput
            value={title}
            onChangeText={(text) => setFieldState("title", text)}
            placeholder="Enter post title"
            className="border border-gray-300 rounded p-2 mb-4"
          />

          <Text style={styles.inputTitle}>Content</Text>
          <TextInput
            value={content}
            onChangeText={(text) => setFieldState("content", text)}
            placeholder="Enter post content"
            multiline
            className="border border-gray-300 rounded p-2 mb-4 text-base"
          />

          <TouchableOpacity
            style={editStyles.saveButton}
            onPress={handleSubmit}
          >
            <Text style={editStyles.saveButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}
