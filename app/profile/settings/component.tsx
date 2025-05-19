import ErrorScreen from "@/components/ErrorScreen";
import HeaderBar from "@/components/HeaderBar";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { ProfileData } from "@/redux/slices/profileSlice";
import { styles } from "@/utility/profile/styles";
import { router, Stack } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

type Props = {
  profileData: ProfileData | null;
  onLogout: () => void;
};

export default function SettingsComponent({ profileData, onLogout }: Props) {
  if (!profileData) {
    return (
      <ErrorScreen message="Something went wrong while loading your profile data. Please refresh or try again later." />
    );
  }

  const { avatarUrl, username } = profileData;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        style={styles.headerContainer}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <HeaderBar title="Settings" />
        <TouchableOpacity
          onPress={() => router.push("/profile/settings/editProfile/container")}
        >
          <View style={styles.settingsTab}>
            <View
              style={[
                styles.avatarContainer,
                { width: 70, height: 70, elevation: 4 },
              ]}
            >
              <Image
                source={{ uri: avatarUrl }}
                style={styles.avatar}
                resizeMode="cover"
              />
            </View>

            <View className="flex-1 flex-col ml-6">
              <Text className="mb-3 font-semibold text-[16px]">{username}</Text>
              <Text>Edit Profile</Text>
            </View>

            <IconSymbol
              name="chevron.right"
              color={Colors.ui.overlay}
              size={20}
            />
          </View>
        </TouchableOpacity>
        <View className="items-center px-4 py-3 justify-center flex-1">
          <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}
