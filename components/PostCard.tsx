import { View, Text, Image, Pressable } from "react-native";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "./ui/IconSymbol";
import styles from "./_styles";

export type Post =
  | {
      id: string;
      type: "recipe" | "tips" | "discussion";
      title: string;
      image: string;
      author: string;
      profilePic: string;
    }
  | {
      id: string;
      type: "community";
      title: string;
      image: string;
      membersCount: number;
      recipesCount: number;
    };

type PostCardProps = {
  post: Post;
  onPress: () => void;
};

export default function PostCard({ post, onPress }: PostCardProps) {
  return (
    <Pressable onPress={onPress} className="mb-4">
      <View
        className="rounded-xl pb-3.5"
        style={{ backgroundColor: Colors.brand.secondary }}
      >
        {post.type === "community" ? (
          <>
            <View className="relative">
              <Image
                source={{ uri: post.image }}
                style={styles.communityImage}
                resizeMode="cover"
              />
              <Pressable
                className="absolute top-3.5 right-3.5 border px-4 py-1.5 rounded-lg"
                style={{
                  backgroundColor: Colors.brand.primaryLight,
                  borderColor: Colors.brand.secondary,
                }}
                onPress={() => {}}
              >
                <Text style={styles.joinButtonText}>Join</Text>
              </Pressable>
            </View>
            <View className="px-4">
              <Text style={styles.communityName}>{post.title}</Text>
              <Text style={styles.communityText}>
                {post.membersCount} members | {post.recipesCount} recipes
              </Text>
            </View>
          </>
        ) : (
          <>
            <Image
              source={{ uri: post.image }}
              style={styles.recipeimage}
              resizeMode="cover"
            />
            <View className="px-2.5">
              <Text style={styles.postTitle}>{post.title}</Text>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1 overflow-hidden">
                  <View style={styles.profileCircle}>
                    <Image
                      source={{ uri: post.profilePic }}
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                  </View>
                  <Text
                    style={styles.author}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {post.author}
                  </Text>
                </View>

                <View className="flex-row items-center space-x-1 pl-2.5">
                  <IconSymbol name="heart" color={Colors.ui.base} size={22} />
                  {/* prettier-ignore */}
                  <IconSymbol name="bookmark" color={Colors.ui.base} size={22} />
                </View>
              </View>
            </View>
          </>
        )}
      </View>
    </Pressable>
  );
};
