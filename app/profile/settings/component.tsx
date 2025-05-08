import React from "react";
// prettier-ignore
import { Text, TouchableOpacity, ScrollView, View } from "react-native";
import { styles } from "@/utility/profile/styles";
import { router, Stack } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";

type Props = {
  onLogout: () => void;
};

export default function SettingsComponent({ onLogout }: Props) {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        style={styles.headerContainer}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-row items-center px-4 py-3">
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol
              name="chevron.left"
              color={Colors.brand.dark}
              size={30}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
        <View className="items-center px-4 py-3 justify-center flex-1 bg-slate-400">
          <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}
