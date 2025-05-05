import { ScrollView, View, Text, Pressable } from "react-native";
import { Colors } from "@/constants/Colors";
import PostCard, { Post } from "@/components/PostCard";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { styles } from "@/utility/home/styles";
import { useFieldState } from "@/hooks/useFieldState";

interface HomeState {
  activeTab: string;
  activeSuggestion: string;
}

type Props = {
  suggestions: string[];
  filteredPosts: Post[];
  home: ReturnType<typeof useFieldState<HomeState>>;
};

export default function HomeComponent({
  suggestions,
  filteredPosts,
  home,
}: Props) {
  const { activeTab, activeSuggestion, setFieldState } = home;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View className="flex-row pb-2">
          {["Follow", "Explore"].map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setFieldState("activeTab", tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === tab
                        ? Colors.brand.main
                        : Colors.text.faint,
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
            <IconSymbol name="magnifyingglass" color={Colors.brand.main} />
          </Pressable>
          <Pressable>
            <IconSymbol name="bell" color={Colors.brand.main} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.suggestContainer}
      >
        {suggestions.map((item) => {
          const isActive = activeSuggestion === item;
          return (
            <Pressable
              key={item}
              onPress={() => setFieldState("activeSuggestion", item)}
              className="px-5 py-1.5 mr-2.5 rounded-full"
              style={{
                backgroundColor: isActive
                  ? Colors.brand.main
                  : Colors.ui.backgroundLight,
              }}
            >
              <Text
                style={[
                  styles.suggestText,
                  {
                    color: isActive ? Colors.brand.accent : Colors.ui.base,
                  },
                ]}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

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
