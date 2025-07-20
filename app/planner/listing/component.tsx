import HeaderBar from "@/components/HeaderBar";
import InputBox from "@/components/InputBox";
import MasonryList from "@/components/MasonryList";
import ScreenWrapper from "@/components/ScreenWrapper";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useFieldState } from "@/hooks/useFieldState";
import { styles } from "@/utility/planner/styles";
import { styles as profileStyles } from "@/utility/profile/styles";
import { styles as searchStyles } from "@/utility/search/styles";
import { Stack } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { ListingState, mainTabs } from "./controller";

type Props = {
  listing: ReturnType<typeof useFieldState<ListingState>>;
  interactionVersion: number;
  type: string;
  communityId?: string;
  handleListingSearch: (type: string, query: string) => void;
  resetSearchResults: (type: string) => void;
  mealtime?: string;
};

export default function ListingComponent({
  listing,
  interactionVersion,
  type,
  communityId,
  handleListingSearch,
  resetSearchResults,
  mealtime,
}: Props) {
  const title = type === "created" ? "Your Posts" : "Likes, Bookmarks & Views";
  const {
    posts,
    likedPosts,
    bookmarkPosts,
    activeTab,
    setFieldState,
    showLoading,
    viewedPosts,
    searchText,
  } = listing;

  const postsToDisplay =
    type === "created"
      ? posts
      : activeTab === "Likes"
      ? likedPosts
      : activeTab === "Collections"
      ? bookmarkPosts
      : activeTab === "Viewed"
      ? viewedPosts
      : [];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenWrapper style={{ backgroundColor: Colors.surface.background }}>
        <ScrollView
          style={profileStyles.headerContainer}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={{ backgroundColor: Colors.brand.onPrimary }}>
            <HeaderBar title={title} />
            <View className="px-3 py-2 flex-row justify-between items-center gap-2">
              <View className="flex-1">
                <InputBox
                  value={searchText}
                  onChangeText={(text) => setFieldState("searchText", text)}
                  placeholder="Search..."
                  icon="magnifyingglass"
                  containerStyle={searchStyles.searchBar}
                  clearColor={Colors.brand.primary}
                  onSubmitEditing={() => handleListingSearch(type, searchText)}
                />
              </View>
              <Pressable onPress={() => resetSearchResults(type)}>
                <IconSymbol
                  name={"arrow.clockwise.circle"}
                  color={Colors.brand.primary}
                />
              </Pressable>
            </View>
          </View>

          {showLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.brand.primary} />
            </View>
          ) : (
            <>
              {type !== "created" && (
                <View style={profileStyles.tabHeader}>
                  {mainTabs.map((tab) => (
                    <Pressable
                      key={tab}
                      onPress={() =>
                        setFieldState(
                          "activeTab",
                          tab as ListingState["activeTab"]
                        )
                      }
                    >
                      <Text
                        style={{
                          fontSize: 17,
                          color:
                            activeTab === tab
                              ? Colors.brand.primary
                              : Colors.text.disabled,
                          fontFamily:
                            activeTab === tab ? "RobotoBold" : "RobotoRegular",
                        }}
                      >
                        {tab}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}

              <View className="mt-3">
                <MasonryList
                  posts={postsToDisplay}
                  interactionVersion={interactionVersion}
                  isFromMealPlan={!communityId}
                  communityId={communityId}
                  mealtime={mealtime}
                />
              </View>
            </>
          )}
        </ScrollView>
      </ScreenWrapper>
    </>
  );
}
