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
import { router } from "expo-router";
import { ProfilePersonal } from "@/utility/profile/types";
import ErrorScreen from "@/components/ErrorScreen";
import { maskEmail } from "@/utility/mask";
import { useLoading } from "@/context/LoadingContext";

const getImageBrightness = (imageUrl: string): boolean => {
  // In a real-world scenario, use a library like react-native-image-colors or process the image data
  // Return true for dark, false for light based on the dominant color.
  // This is just a placeholder for actual brightness detection logic
  return imageUrl.includes("dark") ? true : false; // Placeholder logic
};

export default function EditProfileComponent({ profileData }: ProfilePersonal) {
  const { loading } = useLoading();
  const [isBackgroundDark, setIsBackgroundDark] = useState<boolean>(false);

  useEffect(() => {
    if (!profileData?.profileBg) setIsBackgroundDark(true);
    if (profileData?.profileBg) {
      const brightness = getImageBrightness(profileData.profileBg);
      setIsBackgroundDark(brightness);
    }
  }, [profileData]);

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
    },
    { title: "Bio", value: bio, key: "bio" },
    { title: "Gender", value: gender, key: "gender" },
    { title: "Birthday", value: birthday, key: "birthday" },
    { title: "Phone Number", value: phone, key: "phone" },
    { title: "Email", value: email, alwaysShowValue: true, key: "email" },
  ];

  return (
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
        style={{ height: 210, backgroundColor: Colors.brand.primaryDark }}
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
          onPress={() => {
            // Handle background image change
            console.log("Change background clicked");
          }}
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
          const displayValue =
            item.alwaysShowValue || rawValue
              ? item.title === "Bio"
                ? String(rawValue).slice(0, 22) + "..."
                : item.title === "Email"
                ? maskEmail(String(rawValue))
                : String(rawValue)
              : item.title === "Phone Number"
              ? "Link Now"
              : "Set Now";

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
                  style={{ color: Colors.ui.base, fontFamily: "RobotoMedium" }}
                >
                  {item.title}
                </Text>
                <View className="flex-row items-center space-x-2">
                  <Text
                    style={{
                      color: isSetNow ? Colors.ui.overlay : Colors.ui.base,
                      fontFamily: "RobotoRegular",
                      marginRight: 10,
                    }}
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
  );
}
