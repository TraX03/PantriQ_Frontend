import AsyncStorage from "@react-native-async-storage/async-storage";

const Recent_Searches_Key = "recent_searches";

export async function getRecentSearches(): Promise<string[]> {
  const data = await AsyncStorage.getItem(Recent_Searches_Key);
  return data ? JSON.parse(data) : [];
}

export async function addRecentSearch(query: string) {
  const searches = await getRecentSearches();
  const updated = [query, ...searches.filter((q) => q !== query)].slice(0, 10);
  await AsyncStorage.setItem(Recent_Searches_Key, JSON.stringify(updated));
}

export async function clearRecentSearches() {
  await AsyncStorage.removeItem(Recent_Searches_Key);
}
