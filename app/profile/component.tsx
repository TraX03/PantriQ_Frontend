import React from "react";
//prettier-ignore
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { Colors } from "@/constants/Colors";
import { getAvatarContainerStyle, styles } from "@/utility/profile/styles";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { router } from "expo-router";
import { ProfileDisplay } from "@/utility/profile/types";
import ErrorScreen from "@/components/ErrorScreen";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import { useLoading } from "@/context/LoadingContext";

export default function ProfileComponent({ profileData }: ProfileDisplay) {
  const { logout, isLoggedIn } = useAuth();
  const { checkLogin } = useRequireLogin();
  const { loading } = useLoading();

  if (!profileData && loading) return null;

  if (!profileData) {
    return (
      <ErrorScreen message="Something went wrong while loading your profile data. Please refresh or try again later." />
    );
  }

  const { username, avatarUrl, followersCount, followingCount } = profileData;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginBottom: 10,
            alignItems: "center",
            gap: 8,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              router.push("/profile/settings/editProfile/container")
            }
            // onPress={ () =>
            //   checkLogin(() => {
            //     router.push("/profile/settings/editProfile/container");
            //   })
          >
            <IconSymbol
              name="pencil.and.outline"
              size={28}
              color={Colors.brand.primaryLight}
            />
          </TouchableOpacity>
          <IconSymbol name="ellipsis" size={27} color={Colors.brand.primary} />
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

      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
