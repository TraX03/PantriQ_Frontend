import { Colors } from "@/constants/Colors";
import { Image, StyleSheet, Text, ScrollView, View, useWindowDimensions } from "react-native";

if (__DEV__) {
  require("@/ReactotronConfig");
}

export default function HomeComponent() {
  const { height } = useWindowDimensions();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View className="items-center justify-center" style={{ height }}>
        <Text className="text-5xl">HI</Text>
      </View>
    </ScrollView>
  );
}
