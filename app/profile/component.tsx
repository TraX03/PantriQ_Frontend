import React from "react";
// prettier-ignore
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { Colors } from "@/constants/Colors";
import { getAvatarContainerStyle, styles } from "@/utility/profile/styles";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { router } from "expo-router";
import ErrorScreen from "@/components/ErrorScreen";
import { ProfileData } from "@/redux/slices/profileSlice";

type Props = {
  profileData: ProfileData | null;
  loading: boolean;
  onLogout: () => void;
};

export default function ProfileComponent({
  profileData,
  loading,
  onLogout,
}: Props) {
  if (!profileData && loading) return null;
  if (!profileData)
    return (
      <ErrorScreen message="Something went wrong while loading your profile data. Please refresh or try again later." />
    );

  const { username, avatarUrl, followersCount, followingCount } = profileData;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <View className="flex-row justify-end items-center mb-[10px] gap-[8px]">
          <TouchableOpacity
            onPress={() =>
              router.push("/profile/settings/editProfile/container")
            }
          >
            <IconSymbol
              name="pencil.and.outline"
              size={28}
              color={Colors.brand.light}
            />
          </TouchableOpacity>
          <IconSymbol name="ellipsis" size={27} color={Colors.brand.main} />
        </View>

        <View className="flex-row items-center">
          <View style={getAvatarContainerStyle(Colors.ui.overlay)}>
            <Image
              source={{
                uri: avatarUrl,
              }}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
          <View className="ml-7 flex-1">
            <View className="flex-row items-baseline">
              <Text style={styles.username}>{username}</Text>
            </View>

            <Text style={styles.followInfo}>
              {followersCount} Followers | {followingCount} Following
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
