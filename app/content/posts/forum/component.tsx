import InputBox from "@/components/InputBox";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useFieldState } from "@/hooks/useFieldState";
import { ProfileData } from "@/redux/slices/profileSlice";
import { styles } from "@/utility/content/posts/styles";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { ForumPost, PostState } from "../controller";
import { ForumState } from "./controller";

type Props = {
  post: ReturnType<typeof useFieldState<PostState>>;
  forum: ReturnType<typeof useFieldState<ForumState>>;
  getUpdatedText: (createdAt: Date) => string;
  currentUserProfile: ProfileData;
  handleSubmit: () => Promise<void>;
};

const CommentItem = ({
  avatarUrl,
  username,
  timeAgo,
  content,
}: {
  avatarUrl: string;
  username: string;
  timeAgo: string;
  content: string;
}) => (
  <View className="flex-col my-4">
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center">
        <View className="w-[30px] h-[30px] rounded-full mr-3 overflow-hidden">
          <Image
            source={{ uri: avatarUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <Text style={{ fontFamily: "RobotoMedium" }}>{username}</Text>
      </View>
      <View className="items-end">
        <IconSymbol
          name="ellipsis"
          selectedIcon={1}
          color={Colors.brand.primary}
          size={18}
        />
        <Text style={styles.timeAgoText}>{timeAgo}</Text>
      </View>
    </View>
    <Text style={styles.commentText}>{content}</Text>
  </View>
);

export default function ForumComponent({
  post,
  forum,
  getUpdatedText,
  currentUserProfile,
  handleSubmit,
}: Props) {
  const { postData } = post;
  const { comment, comments, setFieldState } = forum;
  const forumData = postData as ForumPost;

  return (
    <View className="flex-1 px-[12px] pt-[15px]">
      <Text style={styles.content}>{forumData.description}</Text>
      <Text style={styles.dateText}>
        {getUpdatedText(new Date(forumData.createdAt))}
      </Text>

      <View style={styles.divider} />

      <View className="flex-row mb-4 items-center gap-2">
        <Text style={styles.sectionTitle}>Comments</Text>
        <Text style={styles.countLabel}>
          ({postData?.commentCount} comments)
        </Text>
      </View>

      <View className="flex-row items-center">
        <View className="w-[30px] h-[30px] rounded-[20px] mr-2 overflow-hidden">
          <Image
            source={{ uri: currentUserProfile.avatarUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <InputBox
          placeholder="Leave a comment..."
          value={comment}
          onChangeText={(text) => setFieldState("comment", text)}
          containerStyle={styles.commentBar}
          inputStyle={{ paddingLeft: 15 }}
        />
        <Pressable onPress={handleSubmit}>
          <IconSymbol
            name="paperplane.fill"
            color={Colors.brand.primary}
            size={20}
          />
        </Pressable>
      </View>

      <ScrollView className="mt-3 px-1">
        {comments.map((c) => (
          <CommentItem
            key={c.id}
            avatarUrl={c.user.avatarUrl}
            username={c.user.username}
            timeAgo={c.timeAgo}
            content={c.content}
          />
        ))}
      </ScrollView>
    </View>
  );
}
