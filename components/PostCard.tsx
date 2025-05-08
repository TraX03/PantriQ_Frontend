import { View, Text, Image, Pressable } from "react-native";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "./ui/IconSymbol";
import styles from "./styles";

export type Post = {
  id: string;
  type: "recipe" | "tips" | "discussion" | "community";
  title: string;
  image: string;
  author?: string;
  profilePic?: string;
  membersCount?: number;
  recipesCount?: number;
};

type PostCardProps = {
  post: Post;
  onPress: () => void;
};

export default function PostCard({ post, onPress }: PostCardProps) {
  const { type, title, image } = post;

  if (type === "community") {
    const { membersCount, recipesCount } = post;
    return (
      <Pressable onPress={onPress} className="mb-4">
        <View style={styles.container}>
          <View className="relative">
            <Image
              source={{ uri: image }}
              className="w-full h-[150px] rounded-tl-xl rounded-tr-xl mb-2.5"
              resizeMode="cover"
            />
            <Pressable
              className="absolute top-3.5 right-3.5 border px-4 py-1.5 rounded-lg"
              style={styles.joinButton}
              onPress={() => {}}
            >
              <Text style={styles.joinButtonText}>Join</Text>
            </Pressable>
          </View>
          <View className="px-4">
            <Text style={styles.communityName}>{title}</Text>
            <Text style={styles.communityText}>
              {membersCount} members | {recipesCount} recipes
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }

  const { author, profilePic } = post;
  return (
    <Pressable onPress={onPress} className="mb-4">
      <View style={styles.container}>
        <Image
          source={{ uri: image }}
          className="w-full h-[180px] rounded-tl-lg rounded-tr-lg mb-2.5"
          resizeMode="cover"
        />
        <View className="px-2.5">
          <Text style={styles.postTitle}>{title}</Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 overflow-hidden">
              {author && profilePic && (
                <>
                  <View className="w-[23px] h-[23px] rounded-[20px] mr-2 overflow-hidden">
                    <Image
                      source={{ uri: profilePic }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                  <Text
                    style={styles.author}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {author}
                  </Text>
                </>
              )}
            </View>
            <View className="flex-row items-center space-x-1 pl-2.5">
              <IconSymbol name="heart" color={Colors.ui.base} size={22} />
              <IconSymbol name="bookmark" color={Colors.ui.base} size={22} />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
