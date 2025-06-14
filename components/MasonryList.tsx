import { Colors } from "@/constants/Colors";
import { styles as homeStyles } from "@/utility/home/styles";
import React from "react";
import { FlatList, RefreshControl, ScrollView, Text, View } from "react-native";
import PostCard, { Post } from "./PostCard";

interface MasonryListProps {
  posts: Post[];
  interactionVersion: number;
  onRefresh?: () => void;
  refreshing?: boolean;
  header?: React.ReactNode;
}

const MasonryList = ({
  posts,
  interactionVersion,
  onRefresh,
  refreshing,
  header,
}: MasonryListProps) => {
  const leftColumn = posts.filter((_, index) => index % 2 === 0);
  const rightColumn = posts.filter((_, index) => index % 2 === 1);
  const renderItem = ({ item }: { item: Post }) => (
    <PostCard key={`${item.id}-${interactionVersion}`} post={item} />
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      {...(onRefresh && {
        refreshControl: (
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={onRefresh}
            colors={[Colors.brand.primary]}
            progressViewOffset={90}
          />
        ),
      })}
    >
      {header}

      <View className="flex-row justify-between p-2">
        <View className="w-[49%]">
          <FlatList
            data={leftColumn}
            renderItem={renderItem}
            keyExtractor={(item) => `${item.id}-left`}
            scrollEnabled={false}
          />
        </View>
        <View className="w-[49%]">
          <FlatList
            data={rightColumn}
            renderItem={renderItem}
            keyExtractor={(item) => `${item.id}-right`}
            scrollEnabled={false}
          />
        </View>
      </View>

      <View className="flex-row items-center justify-center mb-12 mt-3">
        <View style={homeStyles.divider} />
        <Text style={homeStyles.endText}>You're at the end</Text>
        <View style={homeStyles.divider} />
      </View>
    </ScrollView>
  );
};

export default MasonryList;
