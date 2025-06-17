import { subTabs } from "@/app/profile/component";
import ErrorScreen from "@/components/ErrorScreen";
import IconButton from "@/components/IconButton";
import ScreenWrapper from "@/components/ScreenWrapper";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useFieldState } from "@/hooks/useFieldState";
import { styles } from "@/utility/content/community/styles";
import { styles as postStyles } from "@/utility/content/posts/styles";
import { router } from "expo-router";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { CommunityState } from "./controller";

type Props = {
  community: ReturnType<typeof useFieldState<CommunityState>>;
};

export default function CommunityComponent({ community }: Props) {
  const { communityData, metadata, activeTab, setFieldState } = community;

  if (!communityData)
    return <ErrorScreen message="Community not found or invalid." />;

  const { name, description, membersCount, image, recipesCount } =
    communityData;
  const { width } = Dimensions.get("window");
  const isBackgroundDark = metadata?.images?.[0]?.isDark ?? false;

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View className="relative">
          <Image
            source={{ uri: image }}
            style={{ width, height: 320 }}
            resizeMode="cover"
          />
          <View style={postStyles.overlayContainer}>
            <IconButton
              name="chevron.left"
              onPress={router.back}
              isBackgroundDark={isBackgroundDark}
            />
            <IconButton
              name="ellipsis"
              onPress={() => {}}
              isBackgroundDark={isBackgroundDark}
            />
          </View>
        </View>

        <View style={[styles.info, { width }]}>
          <View className="flex-row items-start justify-between">
            <View className="flex-1 mr-[15px]">
              <Text style={styles.title}>{name}</Text>
            </View>
            <View style={styles.joinButton}>
              <Text style={styles.joinText}>Join</Text>
            </View>
          </View>

          {!!description && (
            <Text className="text-[15px] mt-[10px]">{description}</Text>
          )}

          <Text style={styles.stats}>
            {membersCount} members | {recipesCount} recipes
          </Text>
        </View>

        {/* Tabs */}
        <View className="mt-14">
          <View style={styles.tabContainer}>
            {subTabs.map((tab) => (
              <Pressable
                key={tab}
                onPress={() =>
                  setFieldState("activeTab", tab as CommunityState["activeTab"])
                }
              >
                <Text
                  className={`text-[17px] ${
                    activeTab === tab
                      ? "text-brand-primary font-robotoBold"
                      : "text-text-disabled font-robotoRegular"
                  }`}
                >
                  {tab}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <Pressable style={styles.generateButton}>
        <IconSymbol name="plus" color={Colors.brand.onPrimary} size={22} />
      </Pressable>
    </ScreenWrapper>
  );
}
