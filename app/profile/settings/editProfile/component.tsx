import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  Pressable,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { styles, getAvatarContainerStyle } from "@/utility/profile/styles";
import { router, Stack } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import ErrorScreen from "@/components/ErrorScreen";
import { maskEmail } from "@/utility/mask";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import reactotron from "reactotron-react-native";
import { account, databases, storage } from "@/services/appwrite";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { ID } from "react-native-appwrite";
import mime from "mime";
import * as FileSystem from "expo-file-system";
import { useProfileData } from "@/hooks/useProfileData";

export default function EditProfileComponent() {
  const loading = useSelector((state: RootState) => state.loading.loading);
  const [isBackgroundDark, setIsBackgroundDark] = useState<boolean>(false);
  const profileData = useSelector((state: RootState) => state.profile.userData);

  if (!profileData && loading) return null;

  if (!profileData) {
    return (
      <ErrorScreen message="Something went wrong while loading your profile data. Please refresh or try again later." />
    );
  }

  const {
    username,
    avatarUrl,
    bio,
    gender,
    birthday,
    phone,
    email,
    profileBg,
  } = profileData;

  const fields = [
    {
      title: "Username",
      value: username,
      alwaysShowValue: true,
      key: "username",
      size: 32,
    },
    { title: "Bio", value: bio, key: "bio", size: 160 },
    {
      title: "Gender",
      value: gender,
      key: "gender",
    },
    {
      title: "Birthday",
      value: birthday
        ? new Date(birthday).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : undefined,
      key: "birthday",
    },
    { title: "Phone Number", value: phone, key: "phone" },
    { title: "Email", value: email, alwaysShowValue: true, key: "email" },
  ];

  const pickImageFile = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const mimeType = mime.getType(asset.uri) || "application/octet-stream";

      const fileInfo = await FileSystem.getInfoAsync(asset.uri);

      const fileSize = fileInfo.exists ? fileInfo.size ?? 0 : 0;

      return {
        name: asset.fileName || `background_${Date.now()}`,
        type: mimeType,
        size: fileSize,
        uri: asset.uri,
      };
    }

    return null;
  };

  const uploadToAppwrite = async (file: {
    name: string;
    type: string;
    size: number;
    uri: string;
  }) => {
    const uploadedFile = await storage.createFile(
      AppwriteConfig.BUCKET_ID,
      ID.unique(),
      file
    );

    return uploadedFile.$id;
  };
  const { fetchProfile } = useProfileData();
  const updateUserProfileBackground = async (fileId: string) => {
    const user = await account.get();
    const userId = user.$id;

    const fileUrl = storage.getFileView(AppwriteConfig.BUCKET_ID, fileId).href;

    await databases.updateDocument(
      AppwriteConfig.DATABASE_ID,
      AppwriteConfig.USERS_COLLECTION_ID,
      userId,
      {
        profile_bg: fileId,
      }
    );
    fetchProfile();
    return fileUrl;
  };

  const onChangeBackgroundPress = async () => {
    const file = await pickImageFile();
    if (!file) return;

    try {
      const fileId = await uploadToAppwrite(file);
      await updateUserProfileBackground(fileId);
      console.log("Background updated successfully");
    } catch (error) {
      console.error("Failed to update background:", error);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View
        className="flex-1"
        style={{ backgroundColor: Colors.brand.secondary, paddingTop: 65 }}
      >
        <View className="flex-row items-center px-4 py-3">
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol
              name="chevron.left"
              color={Colors.brand.primaryDark}
              size={30}
            />
          </TouchableOpacity>
          <Text className="text-xl ml-4" style={{ fontFamily: "RobotoMedium" }}>
            Edit Profile
          </Text>
        </View>

        <ImageBackground
          source={{ uri: profileBg }}
          style={{
            height: 210,
            backgroundColor: !profileBg ? Colors.brand.primaryDark : undefined,
          }}
          imageStyle={{ opacity: 0.6 }}
          className="justify-center items-center"
        >
          <View style={getAvatarContainerStyle(Colors.brand.secondary)}>
            <Image
              source={{ uri: avatarUrl }}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>

          {/* Change Background Button */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 15,
              right: 15,
              backgroundColor: isBackgroundDark
                ? "rgba(255,255,255,0.9)"
                : "rgba(0,0,0,0.5)",
              borderRadius: 50,
              paddingHorizontal: 10,
              paddingVertical: 5,
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              borderWidth: isBackgroundDark ? 1 : 0,
              borderColor: isBackgroundDark
                ? Colors.brand.primary
                : "transparent",
            }}
            onPress={onChangeBackgroundPress}
          >
            <Text
              style={{
                fontFamily: "RobotoRegular",
                fontSize: 13,
                color: isBackgroundDark
                  ? Colors.brand.primary
                  : Colors.ui.backgroundLight,
              }}
            >
              Change Background
            </Text>
            <IconSymbol
              name="photo"
              color={
                isBackgroundDark
                  ? Colors.brand.primary
                  : Colors.ui.backgroundLight
              }
              size={20}
            />
          </TouchableOpacity>
        </ImageBackground>

        <View style={{ backgroundColor: Colors.ui.background, flex: 1 }}>
          {fields.map((item, index) => {
            const rawValue = item.value;
            const displayValue = (() => {
              if (item.alwaysShowValue || rawValue) {
                if (item.title === "Email") {
                  return maskEmail(String(rawValue));
                }
                if (item.title === "Gender") {
                  return String(rawValue);
                }
                return String(rawValue);
              }
              if (item.title === "Phone Number") {
                return "Link Now";
              }
              return "Set Now";
            })();

            const shouldHaveGapAbove =
              item.key === "gender" || item.key === "phone";

            const isSetNow =
              displayValue === "Set Now" || displayValue === "Link Now";

            return (
              <Pressable
                key={index}
                onPress={() =>
                  router.push({
                    pathname: "/profile/settings/editProfile/editField/[key]",
                    params: {
                      key: item.key,
                      size: item.size,
                      data: encodeURIComponent(JSON.stringify(profileData)),
                    },
                  })
                }
                className="border-b"
                style={{
                  paddingVertical: 3,
                  backgroundColor: Colors.brand.secondary,
                  marginTop: shouldHaveGapAbove ? 20 : 0,
                  borderTopWidth: shouldHaveGapAbove ? 1 : 0,
                  borderColor: Colors.text.placeholder,
                }}
              >
                <View className="flex-row justify-between items-center px-4 py-3">
                  <Text
                    style={{
                      color: Colors.ui.base,
                      fontFamily: "RobotoMedium",
                    }}
                  >
                    {item.title}
                  </Text>
                  <View className="flex-row items-center space-x-2">
                    <Text
                      style={{
                        color: isSetNow ? Colors.ui.overlay : Colors.ui.base,
                        fontFamily: "RobotoRegular",
                        marginRight: 10,
                        maxWidth: item.title === "Bio" ? 180 : undefined,
                      }}
                      ellipsizeMode={item.title === "Bio" ? "tail" : undefined}
                      numberOfLines={item.title === "Bio" ? 1 : undefined}
                    >
                      {displayValue}
                    </Text>
                    <IconSymbol
                      name="chevron.right"
                      color={Colors.ui.overlay}
                      size={20}
                    />
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </>
  );
}
