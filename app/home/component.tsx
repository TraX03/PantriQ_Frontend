import { ScrollView, View, Text, Pressable } from "react-native";
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
    <ScrollView style={{ flex: 1, backgroundColor: Colors.ui.background }}>
      {/* Header */}
      <View
        className="flex-row items-end justify-between px-4 h-28 mb-[2px]"
        style={{ backgroundColor: Colors.brand.secondary }}
      >
        <View className="flex-row pb-2">
          {["Follow", "Explore"].map((tab) => (
            <Pressable key={tab} onPress={() => setActiveTab(tab)}>
              <Text
                className="text-[23px] mr-5"
                style={{
                  fontFamily: "RobotoMedium",
                  color:
                    activeTab === tab
                      ? Colors.brand.primary
                      : Colors.text.faint,
                }}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="flex-row items-center space-x-4 pb-2">
          <Pressable className="mr-2">
            <IconSymbol name="magnifyingglass" color={Colors.brand.primary} />
          </Pressable>
          <Pressable>
            <IconSymbol name="bell" color={Colors.brand.primary} />
          </Pressable>
        </View>
      </View>

      {/* Suggestion Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-2 py-3"
        style={{ backgroundColor: Colors.brand.secondary }}
      >
        {suggestions.map((item) => {
          const isActive = activeSuggestion === item;
          return (
            <Pressable
              key={item}
              onPress={() => setActiveSuggestion(item)}
              className="px-5 py-1.5 mr-2.5 rounded-full"
              style={{
                backgroundColor: isActive
                  ? Colors.brand.primary
                  : Colors.ui.backgroundLight,
              }}
            >
              <Text
                style={{
                  fontFamily: "RobotoRegular",
                  fontSize: 14,
                  color: isActive ? Colors.brand.secondary : Colors.ui.base,
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
            <View className="flex-row justify-between flex-wrap">
              {[0, 1].map((colIndex) => (
                <View key={colIndex} className="w-[48%]">
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
