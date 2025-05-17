import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { styles as profileStyles } from "@/utility/profile/styles";
import { styles } from "@/utility/create/styles";
import { Post } from "@/components/PostCard";

type PostTypeSelectorProps = {
  postType: Post["type"];
  setPostType: (type: Post["type"]) => void;
};

export default function PostTypeSelector({ postType, setPostType }: PostTypeSelectorProps) {
  const options: Post["type"][] = ["tips", "discussion"];

  return (
    <>
      <Text style={styles.inputTitle}>Post Type</Text>
      <View className="flex-row mb-6 gap-3">
        {options.map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setPostType(type)}
            className="flex-row items-center px-4 py-2 rounded-full border"
            style={{
              borderColor:
                postType === type ? Colors.brand.main : Colors.text.placeholder,
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
              {postType === type && <View style={profileStyles.radioButtom} />}
            </View>
            <Text className="capitalize">
              {type === "tips" ? "Tips & Advice" : type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}
