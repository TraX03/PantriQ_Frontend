import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import React from "react";
import { useAuth } from "../../features/authentication/context";
import { Colors } from "@/constants/Colors";

interface Props {
  profileData: {
    username: string;
    avatarUrl: string;
    followers_count: number;
    following_count: number;
  } | null;
  loading: boolean;
}

export default function ProfileComponent({ profileData, loading }: Props) {
  const { logout } = useAuth();

  // Show loading indicator while fetching data
  if (loading) {
    return <ActivityIndicator size="large" color={Colors.ui.buttonFill} />;
  }

  // If profileData is null (error case)
  if (!profileData) {
    return <Text>Failed to load profile data</Text>;
  }

  const { username, avatarUrl, followers_count, following_count } = profileData;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.ui.background }}>
      <View
        style={{
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            padding: 20,
            marginBottom: 30,
            paddingTop: 100,
          }}
        >
          <View
            style={{
              width: 90,
              height: 90,
              borderRadius: 50,
              marginBottom: 10,
              alignSelf: "center",
              elevation: 5,
            }}
          >
            <Image
              source={{
                uri: avatarUrl,
              }}
              style={{
                width: 90,
                height: 90,
                borderRadius: 50,
                marginBottom: 10,
                alignSelf: "center",
              }}
            />
          </View>

          <View style={{ marginLeft: 25 }}>
            <Text style={{ fontSize: 20, fontFamily: "RobotoSemiBold" }}>
              {username}
            </Text>

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Text
                style={{
                  marginRight: 20,
                  fontSize: 14,
                  fontFamily: "RobotoRegular",
                  color: Colors.text.faint,
                }}
              >
                {followers_count} Followers | {following_count} Following
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Log Out Button */}
      <TouchableOpacity
        onPress={logout}
        style={{
          backgroundColor: Colors.ui.buttonFill,
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 10,
          marginTop: 30,
          width: 100,
          alignSelf: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
