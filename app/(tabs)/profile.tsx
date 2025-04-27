import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "../../features/authentication/context";
import { Colors } from "@/constants/Colors";

export default function ProfilePage() {
  const { logout } = useAuth(); // Using the hook here

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Profile</Text>

      <TouchableOpacity
        onPress={logout}
        style={{
          backgroundColor: Colors.ui.buttonFill,
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};
