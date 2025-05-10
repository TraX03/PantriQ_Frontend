import React from "react";
// prettier-ignore
import { Text, TouchableOpacity, ScrollView, View } from "react-native";
import { styles } from "@/utility/profile/styles";
import { Stack } from "expo-router";
import HeaderBar from "@/components/HeaderBar";

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
        <HeaderBar title="Settings" />
        <View className="items-center px-4 py-3 justify-center flex-1 bg-slate-400">
          <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}
