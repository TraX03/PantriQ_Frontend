import MasonryList from "@/components/MasonryList";
import { IconSymbol } from "@/components/ui/IconSymbol";
import UserCard from "@/components/UserCard";
import { Colors } from "@/constants/Colors";
import { useFieldState } from "@/hooks/useFieldState";
import { User } from "@/utility/fetchUtils";
import { styles } from "@/utility/search/styles";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SearchResultState, tabs } from "./controller";

export type Props = {
  searchResult: ReturnType<typeof useFieldState<SearchResultState>>;
  filteredUsers: User[];
  interactionVersion: number;
};

export default function SearchResultComponent({
  searchResult,
  filteredUsers,
  interactionVersion,
}: Props) {
  const { filterActive, orderActive, activeTab, filteredPosts, setFieldState } =
    searchResult;

  return (
    <>
      <View
        className="flex-row items-center flex-wrap px-4 py-2"
        style={styles.tabsContainer}
      >
        {tabs.map((tab, index) => (
          <View key={tab} className="flex-row items-center mt-3">
            <Pressable onPress={() => setFieldState("activeTab", tab)}>
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === tab
                        ? Colors.brand.primaryDark
                        : Colors.text.disabled,
                  },
                ]}
              >
                {tab}
              </Text>
            </Pressable>

            {index < tabs.length - 1 && <Text style={styles.divider}>|</Text>}
          </View>
        ))}

        <View className="flex-row items-center flex-1 justify-end gap-2">
          <Pressable
            onPress={() => setFieldState("filterActive", !filterActive)}
          >
            <IconSymbol
              name="line.horizontal.3.decrease"
              size={22}
              color={filterActive ? Colors.brand.primary : Colors.text.primary}
              selectedIcon={filterActive ? 1 : 0}
            />
          </Pressable>
          <Pressable onPress={() => setFieldState("orderActive", !orderActive)}>
            <IconSymbol
              name="list.bullet.indent"
              size={22}
              color={orderActive ? Colors.brand.primary : Colors.text.primary}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {activeTab === "Users" ? (
          filteredUsers.length === 0 ? (
            <View className="items-center justify-center mt-10">
              <Text style={styles.noUserText}>No users found</Text>
            </View>
          ) : (
            <View className="mt-1">
              {filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </View>
          )
        ) : filteredPosts.length === 0 ? (
          <View className="items-center justify-center mt-10">
            <Text style={styles.noFoundText}>
              No results found for "{activeTab}"
            </Text>
          </View>
        ) : (
          <MasonryList
            posts={filteredPosts}
            interactionVersion={interactionVersion}
            source={"searchResults"}
          />
        )}
      </ScrollView>
    </>
  );
}
