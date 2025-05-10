import React from "react";
// prettier-ignore
import { View, Text, TouchableOpacity, Image, ScrollView, ImageBackground, StyleSheet, Pressable } from "react-native";
import { Colors } from "@/constants/Colors";
import { styles } from "@/utility/profile/styles";
import { IconSymbol, IconSymbolName } from "@/components/ui/IconSymbol";
import { router } from "expo-router";
import ErrorScreen from "@/components/ErrorScreen";
import { ProfileData } from "@/redux/slices/profileSlice";
import { LinearGradient } from "expo-linear-gradient";
import { useFieldState } from "@/hooks/useFieldState";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { storage } from "@/services/appwrite";
import PostCard from "@/components/PostCard";
import { ProfileState } from "./controller";

type Props = {
  profileData: ProfileData | null;
  loading: boolean;
  isLoggedIn: boolean;
  checkLogin: (intendedPage: string) => void;
  profile: ReturnType<typeof useFieldState<ProfileState>>;
};

const tabs: { title: string; icon: IconSymbolName }[] = [
  { title: "History", icon: "clock" },
  { title: "Community", icon: "person.2.fill" },
];

export default function ProfileComponent({
  profileData,
  loading,
  isLoggedIn,
  checkLogin,
  profile,
}: Props) {
  if (!profileData && loading) return null;
  if (!profileData)
    return (
      <ErrorScreen message="Something went wrong while loading your profile data. Please refresh or try again later." />
    );

  const { activeTab, posts, setFieldState } = profile;

  const {
    username,
    avatarUrl,
    followersCount,
    followingCount,
    profileBg,
    bio,
  } = profileData;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ImageBackground
        source={{ uri: profileBg }}
        style={[
          styles.profileSection,
          { backgroundColor: profileBg ? undefined : Colors.brand.main },
        ]}
      >
        <LinearGradient
          colors={["transparent", Colors.ui.shade]}
          locations={[0, 0.3]}
          style={StyleSheet.absoluteFillObject}
        />

        <View className="flex-row justify-end items-center mb-[10px] gap-[12px]">
          <TouchableOpacity
            onPress={() =>
              checkLogin("/profile/settings/editProfile/container")
            }
          >
            <IconSymbol
              name="pencil.and.outline"
              size={28}
              color={Colors.brand.accent}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/profile/settings/container")}
          >
            <IconSymbol name="ellipsis" size={27} color={Colors.brand.accent} />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center">
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: avatarUrl,
              }}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
          <View className="ml-7 flex-1">
            <View className="flex-row items-center gap-2">
              <Text style={styles.username}>{username}</Text>
              {!isLoggedIn && (
                <TouchableOpacity
                  onPress={() => router.push("/authentication/sign-in")}
                  style={styles.loginButton}
                >
                  <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.followInfo}>
              {followersCount} Followers | {followingCount} Following
            </Text>
          </View>
        </View>

        {isLoggedIn && <Text style={styles.bioText}>{bio}</Text>}

        <View className="flex-row justify-start mt-5">
          {tabs.map(({ title, icon }, index) => (
            <TouchableOpacity
              key={index}
              style={styles.profileTab}
              activeOpacity={0.8}
              onPress={() => {}}
            >
              <IconSymbol name={icon} size={26} color={Colors.brand.accent} />
              <Text style={styles.profileTabText}>{title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ImageBackground>

      <View style={styles.postListContainer}>
        <View style={styles.tabHeader}>
          {["Posts", "Collections", "Likes"].map((tab) => (
            <Pressable
              key={tab}
              onPress={() =>
                setFieldState("activeTab", tab as ProfileState["activeTab"])
              }
            >
              <Text
                style={{
                  fontSize: 17,
                  color:
                    activeTab === tab ? Colors.brand.main : Colors.text.faint,
                  fontFamily:
                    activeTab === tab ? "RobotoBold" : "RobotoRegular",
                }}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {activeTab === "Posts" && (
          <View className="px-[6px]">
            {posts.length === 0 ? (
              <Text style={styles.noPostText}>No posts to display.</Text>
            ) : (
              <View className="flex-row justify-between flex-wrap">
                {[0, 1].map((colIndex) => (
                  <View key={colIndex} className="w-[48%]">
                    {posts
                      .slice()
                      .sort(
                        (a, b) =>
                          new Date(b.created_at).getTime() -
                          new Date(a.created_at).getTime()
                      )
                      .filter((_, i) => i % 2 === colIndex)
                      .map((post) => (
                        <PostCard
                          key={post.$id}
                          post={{
                            id: post.$id,
                            type: post.type,
                            title: post.title,
                            image: storage.getFileView(
                              AppwriteConfig.BUCKET_ID,
                              post.image[0]
                            ).href,
                            author: username,
                            profilePic: avatarUrl,
                          }}
                          onPress={() => {}}
                        />
                      ))}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
