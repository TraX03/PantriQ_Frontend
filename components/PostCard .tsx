import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "./ui/IconSymbol";

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
      <View style={styles.cardContainer}>
        {post.type === "community" ? (
          <>
            <View className="relative">
              <Image
                source={{ uri: post.image }}
                style={styles.communityImageFull}
                resizeMode="cover"
              />
              <Pressable style={styles.joinButton} onPress={() => {}}>
                <Text style={styles.joinButtonText}>Join</Text>
              </Pressable>
            </View>
            <View className="px-4">
              <Text style={styles.communityName}>{post.title}</Text>
              <Text style={styles.communityText}>
                {post.membersCount} members  |  {post.recipesCount} recipes
              </Text>
            </View>
          </>
        ) : (
          <>
            <Image
              source={{ uri: post.image }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.content}>
              <Text style={styles.title}>{post.title}</Text>

              <View style={styles.footer}>
                <View style={styles.userSection}>
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

                <View style={styles.iconSection}>
                  <IconSymbol
                    name="heart"
                    color={Colors.defaultColor}
                    size={22}
                  />
                  <IconSymbol
                    name="bookmark"
                    color={Colors.defaultColor}
                    size={22}
                  />
                </View>
              </View>
            </View>
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    paddingBottom: 12,
  },
  image: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 8,
  },
  communityImageFull: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: 8,
  },
  communityName: {
    fontSize: 16,
    fontFamily: "RobotoMedium",
    marginBottom: 8,
  },
  communityStatsRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  communityText: {
    fontSize: 12,
    fontFamily: "RobotoRegular",
    color: Colors.inactive,
    paddingBottom: 8,
  },
  joinButton: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "#ed7285",
    borderColor: Colors.secondary,
    borderWidth: 0.5,
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 10,
    zIndex: 10,
  },
  joinButtonText: {
    color: Colors.secondary,
    fontFamily: "RobotoRegular",
    fontSize: 14,
  },
  content: {
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 14,
    fontFamily: "RobotoMedium",
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    flexGrow: 1,
    overflow: "hidden",
  },
  profileCircle: {
    width: 23,
    height: 23,
    borderRadius: 20,
    backgroundColor: "#ccc",
    marginRight: 6,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  author: {
    fontSize: 11,
    fontFamily: "RobotoRegular",
    color: Colors.inactive,
    flexShrink: 1,
    flexGrow: 1,
    overflow: "hidden",
  },
  iconSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingLeft: 8,
    flexShrink: 0,
    flexGrow: 0,
  },
});
