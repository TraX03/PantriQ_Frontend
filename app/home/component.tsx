import PostCard, { Post } from "@/components/PostCard";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useFieldState } from "@/hooks/useFieldState";
import { styles } from "@/utility/home/styles";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { HomeState } from "./controller";

type Props = {
  suggestions: string[];
  filteredPosts: Post[];
  home: ReturnType<typeof useFieldState<HomeState>>;
  onRefresh: () => Promise<void>;
  refreshing: boolean;
};

export default function HomeComponent({
  suggestions,
  filteredPosts,
  home,
  onRefresh,
  refreshing,
}: Props) {
  const { activeTab, activeSuggestion } = home;
  const { setFieldState } = home;

  const renderPosts = () => {
    if (activeTab !== "Explore") return null;

    if (activeSuggestion === "Communities") {
      return (
        <View>
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </View>
      );
    }

    return (
      <View className="flex-row justify-between flex-wrap">
        {[0, 1].map((colIndex) => (
          <View key={colIndex} className="w-[48%]">
            {filteredPosts
              .filter((_, i) => i % 2 === colIndex)
              .map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View className="flex-row">
          {["Follow", "Explore"].map((tab) => (
            <Pressable
              key={tab}
              onPress={() =>
                setFieldState("activeTab", tab as HomeState["activeTab"])
              }
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === tab ? Colors.brand.main : Colors.text.faint,
                  },
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="flex-row items-center gap-2">
          <Pressable>
            <IconSymbol name="magnifyingglass" color={Colors.brand.main} />
          </Pressable>
          <Pressable>
            <IconSymbol name="bell" color={Colors.brand.main} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.brand.main]}
          />
        }
      >
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

        <View className="p-2">{renderPosts()}</View>
      </ScrollView>
    </View>
  );
}
