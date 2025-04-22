import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import PostCard, { Post } from "@/components/PostCard";
import { IconSymbol } from "@/components/ui/IconSymbol";

type Props = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeSuggestion: string;
  setActiveSuggestion: (sugg: string) => void;
  suggestions: string[];
  filteredPosts: Post[];
};

export default function HomeComponent({
  activeTab,
  setActiveTab,
  activeSuggestion,
  setActiveSuggestion,
  suggestions,
  filteredPosts,
}: Props) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
      <View
        className="flex-row items-end justify-between px-4 h-28"
        style={{ backgroundColor: Colors.secondary, marginBottom: 2 }}
      >
        <View className="flex-row pb-2">
          {["Follow", "Explore"].map((tab) => (
            <Pressable key={tab} onPress={() => setActiveTab(tab)}>
              <Text
                style={[
                  styles.tabText,
                  {
                    color: activeTab === tab ? Colors.primary : Colors.inactive,
                  },
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
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

      {/* Post List */}
      {activeTab === "Explore" && (
        <View className="p-2">
          {activeSuggestion === "Communities" ? (
            <View>
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} onPress={() => {}} />
              ))}
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              {[0, 1].map((colIndex) => (
                <View key={colIndex} style={{ width: "48%" }}>
                  {filteredPosts
                    .filter((_, i) => i % 2 === colIndex)
                    .map((post) => (
                      <PostCard key={post.id} post={post} onPress={() => {}} />
                    ))}
                </View>
              ))}
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
