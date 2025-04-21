import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import Reactotron from "reactotron-react-native";
//prettier-ignore
import { Text, ScrollView, View, Pressable, StyleSheet } from "react-native";
import PostCard, { Post } from "@/components/PostCard ";
import { mockPosts } from "../data/mockPosts";

if (__DEV__) {
  require("@/ReactotronConfig");
}

const suggestions = ["Recipe", "Tips & Advice", "Communities", "Discussions"];

export default function HomeComponent() {
  const [activeTab, setActiveTab] = useState("Explore");
  const [activeSuggestion, setActiveSuggestion] = useState("Recipe");

  // Filter posts based on the active suggestion
  const filteredPosts = mockPosts.filter((post) => {
    switch (activeSuggestion) {
      case "Recipe":
        return post.type === "recipe";
      case "Tips & Advice":
        return post.type === "tips";
      case "Communities":
        return post.type === "community";
      case "Discussions":
        return post.type === "discussion";
      default:
        return true;
    }
  });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header Bar */}
      <View
        className="flex-row items-end justify-between px-4 h-28"
        style={{
          backgroundColor: Colors.secondary,
          marginBottom: 2,
        }}
      >
        {/* Text Tabs */}
        <View className="flex-row pb-2">
          <Pressable onPress={() => setActiveTab("Follow")}>
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === "Follow" ? Colors.primary : Colors.inactive,
                },
              ]}
            >
              Follow
            </Text>
          </Pressable>

          <Pressable onPress={() => setActiveTab("Explore")}>
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === "Explore" ? Colors.primary : Colors.inactive,
                },
              ]}
            >
              Explore
            </Text>
          </Pressable>
        </View>

        <View className="flex-row items-center space-x-4 pb-2">
          <Pressable className="mr-2">
            <IconSymbol name="magnifyingglass" color={Colors.primary} />
          </Pressable>
          <Pressable>
            <IconSymbol name="bell" color={Colors.primary} />
          </Pressable>
        </View>
      </View>

      {/* Suggestion Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="bg-white px-2"
        style={{ paddingVertical: 8 }}
      >
        {suggestions.map((item) => {
          const isActive = activeSuggestion === item;
          return (
            <Pressable
              key={item}
              onPress={() => setActiveSuggestion(item)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 5,
                marginRight: 8,
                borderRadius: 999,
                backgroundColor: isActive ? Colors.primary : "#f3f4f6",
              }}
            >
              <Text
                style={{
                  fontFamily: "RobotoRegular",
                  fontSize: 14,
                  color: isActive ? Colors.secondary : "#374151",
                }}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Post List Grid */}
      {activeTab === "Explore" && (
        <View className="p-2">
          {activeSuggestion === "Communities" ? (
            // Single column layout for communities
            <View>
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post as Post}
                  onPress={() => {}}
                />
              ))}
            </View>
          ) : (
            // Two-column grid for all other types
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <View style={{ width: "48%" }}>
                {filteredPosts
                  .filter((_, i) => i % 2 === 0)
                  .map((post) => (
                    <PostCard
                      key={post.id}
                      post={post as Post}
                      onPress={() => {}}
                    />
                  ))}
              </View>
              <View style={{ width: "48%" }}>
                {filteredPosts
                  .filter((_, i) => i % 2 === 1)
                  .map((post) => (
                    <PostCard
                      key={post.id}
                      post={post as Post}
                      onPress={() => {}}
                    />
                  ))}
              </View>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabText: {
    fontFamily: "RobotoMedium",
    fontSize: 23,
    marginRight: 16,
  },
});
