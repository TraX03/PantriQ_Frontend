import { Colors } from "@/constants/Colors";
import { Routes } from "@/constants/Routes";
import { useInteraction } from "@/hooks/useInteraction";
import { router } from "expo-router";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { IconSymbol } from "./ui/IconSymbol";

export type PostType = "recipe" | "tips" | "discussion" | "community";

export type Post = {
  id: string;
  type: PostType;
  title: string;
  image: string;
  area?: string;
  author?: string;
  profilePic?: string;
  membersCount?: number;
  recipesCount?: number;
  description?: string;
};

type PostCardProps = {
  post: Post;
};

export default function PostCard({ post }: PostCardProps) {
  const { type, title, image, id } = post;
  const { isLiked, isBookmarked, toggleLike, toggleBookmark } = useInteraction(
    post.id
  );

  if (type === "community") {
    const { membersCount, recipesCount } = post;
    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: Routes.PostDetail,
            params: { id: id },
          })
        }
        className="mb-4"
      >
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
      </TouchableOpacity>
    );
  }

  const { author, profilePic } = post;
  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: Routes.PostDetail,
          params: { id: id },
        })
      }
      className="mb-4"
    >
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
              <Pressable onPress={toggleLike}>
                <IconSymbol
                  name={isLiked ? "heart.fill" : "heart"}
                  color={isLiked ? Colors.brand.primary : Colors.brand.onBackground}
                  size={21}
                />
              </Pressable>
              <Pressable onPress={toggleBookmark}>
                <IconSymbol
                  name={isBookmarked ? "bookmark.fill" : "bookmark"}
                  color={isBookmarked ? Colors.brand.primary : Colors.brand.onBackground}
                  size={21}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
