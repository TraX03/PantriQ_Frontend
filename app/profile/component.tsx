import ErrorScreen from "@/components/ErrorScreen";
import PostCard from "@/components/PostCard";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { Routes } from "@/constants/Routes";
import { useFieldState } from "@/hooks/useFieldState";
import { ProfileData } from "@/redux/slices/profileSlice";
import { getImageUrl, getOverlayStyle } from "@/utility/imageUtils";
import { styles } from "@/utility/profile/styles";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ProfileState } from "./controller";

type Props = {
  profileData: ProfileData | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  checkLogin: (intendedPage: string) => void;
  profile: ReturnType<typeof useFieldState<ProfileState>>;
  isOwnProfile: boolean;
  isBackgroundDark: boolean;
};

const tabs = [
  { title: "History", icon: "clock" },
  { title: "Community", icon: "person.2.fill" },
] as const;

const mainTabs = ["Posts", "Collections", "Likes"] as const;
const subTabs = ["Recipe", "Tips", "Discussion"] as const;

export default function ProfileComponent({
  profileData,
  isLoading,
  isLoggedIn,
  checkLogin,
  profile,
  isOwnProfile,
  isBackgroundDark,
}: Props) {
  if (isLoading && !profileData) return null;

  if (!profileData)
    return (
      <ErrorScreen message="Something went wrong while loading your profile data. Please refresh or try again later." />
    );

  const {
    activeTab,
    posts,
    subTab: postSubTab,
    setFieldState,
    postLoading,
  } = profile;

  const {
    username,
    avatarUrl,
    followersCount,
    followingCount,
    profileBg,
    bio,
  } = profileData;

  const filteredPosts = posts.filter((p) => {
    if (postSubTab === "Recipe") return p.type === "recipe";
    return p.type.toLowerCase() === postSubTab.toLowerCase();
  });

  const sortedPosts = filteredPosts
    .slice()
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={{ uri: profileBg }}
          style={[
            styles.profileSection,
            { backgroundColor: profileBg ? undefined : Colors.brand.primary },
          ]}
        >
          <LinearGradient
            colors={["transparent", Colors.overlay.subtleDark]}
            locations={[0, 0.3]}
            style={StyleSheet.absoluteFillObject}
          />

          <View className="flex-row justify-between items-center mb-[16px]">
            {isOwnProfile ? (
              <View className="w-[28px]" />
            ) : (
              <TouchableOpacity onPress={() => router.back()}>
                <IconSymbol
                  name="chevron.left"
                  size={28}
                  color={Colors.brand.onPrimary}
                />
              </TouchableOpacity>
            )}

            <View className="flex-row items-center gap-[12px]">
              {isOwnProfile ? (
                <>
                  <TouchableOpacity
                    onPress={() => checkLogin(Routes.EditProfile)}
                  >
                    <IconSymbol
                      name="pencil.circle"
                      size={28}
                      color={Colors.brand.onPrimary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => checkLogin(Routes.Settings)}>
                    <IconSymbol
                      name="square.grid.2x2"
                      size={27}
                      color={Colors.brand.onPrimary}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  onPress={() => console.log("Ellipsis options")}
                >
                  <IconSymbol
                    name="ellipsis"
                    size={26}
                    color={Colors.brand.onPrimary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View className="flex-row items-center">
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: avatarUrl }}
                style={styles.avatar}
                resizeMode="cover"
              />
            </View>
            <View className="ml-7 flex-1">
              <View className="flex-row items-center gap-2">
                <Text style={styles.username}>{username}</Text>
                {!isLoggedIn && isOwnProfile && (
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: Routes.AuthForm,
                        params: { mode: "sign-in" },
                      })
                    }
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

          {isLoggedIn || !isOwnProfile ? (
            <Text style={styles.bioText}>{bio}</Text>
          ) : null}

          {isOwnProfile && isLoggedIn ? (
            <View className="flex-row justify-start mt-5">
              {tabs.map(({ title, icon }) => (
                <TouchableOpacity
                  key={title}
                  style={styles.profileTab}
                  activeOpacity={0.8}
                  onPress={() => {}}
                >
                  <IconSymbol
                    name={icon}
                    size={26}
                    color={Colors.brand.onPrimary}
                  />
                  <Text style={styles.profileTabText}>{title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : !isOwnProfile ? (
            <View className="flex-row justify-end mt-5">
              <TouchableOpacity
                style={[getOverlayStyle(isBackgroundDark), styles.followButton]}
                onPress={() => console.log("Follow pressed")}
              >
                <Text
                  style={[
                    getOverlayStyle(isBackgroundDark, true),
                    { fontFamily: "RobotoRegular" },
                  ]}
                >
                  Follow
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="h-5" />
          )}
        </ImageBackground>

        <View style={styles.postListContainer}>
          <View style={styles.tabHeader}>
            {mainTabs.map((tab) => (
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
                      activeTab === tab
                        ? Colors.brand.primary
                        : Colors.text.disabled,
                    fontFamily:
                      activeTab === tab ? "RobotoBold" : "RobotoRegular",
                  }}
                >
                  {tab}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.subTabHeader}>
            {subTabs.map((sub) => (
              <Pressable
                key={sub}
                onPress={() =>
                  setFieldState("subTab", sub as ProfileState["subTab"])
                }
              >
                <Text
                  style={{
                    fontSize: 15,
                    color:
                      postSubTab === sub
                        ? Colors.brand.primary
                        : Colors.text.disabled,
                    fontFamily:
                      postSubTab === sub ? "RobotoBold" : "RobotoRegular",
                  }}
                >
                  {sub}
                </Text>
              </Pressable>
            ))}
          </View>

          {activeTab === "Posts" && (
            <View className="px-[6px]">
              {postLoading ? (
                <View style={styles.loadingContianer}>
                  <ActivityIndicator
                    size="large"
                    color={Colors.brand.primary}
                  />
                </View>
              ) : filteredPosts.length === 0 ? (
                <Text style={styles.noPostText}>No posts to display.</Text>
              ) : (
                <View className="flex-row justify-between flex-wrap">
                  {[0, 1].map((colIndex) => (
                    <View key={colIndex} className="w-[48%]">
                      {sortedPosts
                        .filter((_, i) => i % 2 === colIndex)
                        .map((post) => (
                          <PostCard
                            key={post.$id}
                            post={{
                              id: post.$id,
                              type: post.type,
                              title: post.title,
                              image: getImageUrl(post.image?.[0]),
                              author: username,
                              profilePic: avatarUrl,
                            }}
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
    </ScreenWrapper>
  );
}
