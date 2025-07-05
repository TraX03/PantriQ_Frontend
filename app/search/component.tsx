import HeaderBar from "@/components/HeaderBar";
import InputBox from "@/components/InputBox";
import ScreenWrapper from "@/components/ScreenWrapper";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useFieldState } from "@/hooks/useFieldState";
import { styles as profileStyles } from "@/utility/profile/styles";
import { styles } from "@/utility/search/styles";
import { Stack } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SearchState } from "./controller";
import SearchResultContainer from "./searchResult/container";

type Props = {
  search: ReturnType<typeof useFieldState<SearchState>>;
  handleSearch: (term?: string) => void;
  handleClear: () => void;
};

export default function SearchComponent({
  search,
  handleSearch,
  handleClear,
}: Props) {
  const {
    allFilteredPosts,
    filteredUsers,
    recentSearches,
    searchText,
    hasSearched,
    expanded,
    postLoading,
    setFieldState,
  } = search;

  const displayedSearches = expanded
    ? recentSearches
    : recentSearches.slice(0, 7);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenWrapper>
        <View style={profileStyles.headerContainer}>
          <HeaderBar
            titleComponent={
              <InputBox
                value={searchText}
                onChangeText={(text) => setFieldState("searchText", text)}
                placeholder="Search..."
                icon="magnifyingglass"
                containerStyle={styles.searchBar}
                clearColor={Colors.brand.primary}
                onSubmitEditing={() => handleSearch()}
              />
            }
          />
          {hasSearched ? (
            <SearchResultContainer
              allFilteredPosts={allFilteredPosts}
              filteredUsers={filteredUsers}
              postLoading={postLoading}
            />
          ) : (
            <View className="px-4 py-3">
              <View className="flex-row items-center justify-between mb-4">
                <Text style={styles.titleText}>Recent Searches</Text>
                <TouchableOpacity onPress={handleClear}>
                  <IconSymbol
                    name="trash"
                    color={Colors.brand.primary}
                    size={22}
                  />
                </TouchableOpacity>
              </View>

              <View className="flex-row flex-wrap gap-3">
                {displayedSearches.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSearch(item)}
                  >
                    <View style={styles.itemContainer}>
                      <Text style={styles.itemText}>{item}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {recentSearches.length > 7 && (
                <TouchableOpacity
                  onPress={() => {
                    setFieldState("expanded", !expanded);
                  }}
                  className="mt-2 mb-4"
                >
                  <Text style={styles.expandText}>
                    {expanded ? "Show Less" : "Show More"}
                  </Text>
                </TouchableOpacity>
              )}

              <View className="flex-row items-center justify-between mb-4">
                <Text style={styles.titleText}>Search by Meal Type</Text>
              </View>
            </View>
          )}
        </View>
      </ScreenWrapper>
    </>
  );
}
