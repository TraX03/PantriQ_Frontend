import { View, Text, Pressable, ScrollView } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function OnboardingComponent() {
  const suggestions = [
    "Gluten",
    "Dairy",
    "Egg",
    "Soy",
    "Peanut",
    "Wheat",
    "Milk",
    "Fish",
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View
        className="flex-1 px-7 pt-24 pb-10"
        style={{ backgroundColor: Colors.brand.secondary }}
      >
        {/* Top Nav */}
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row" style={{ gap: 6 }}>
            {[1, 2, 3, 4].map((num, i) => (
              <View
                key={i}
                className={`w-7 h-7 rounded-full items-center justify-center`}
                style={{
                  backgroundColor:
                    num === 1 ? Colors.ui.buttonFill : Colors.ui.backgroundDark,
                }}
              >
                <Text
                  style={{
                    color:
                      num === 1 ? Colors.brand.secondary : Colors.brand.base,
                    fontSize: 13,
                    fontFamily: "RobotoRegular",
                  }}
                >
                  {num}
                </Text>
              </View>
            ))}
          </View>
          <Pressable>
            <Text
              style={{
                fontSize: 18,
                color: Colors.text.linkColor,
                fontFamily: "RobotoSemiBold",
              }}
            >
              Skip
            </Text>
          </Pressable>
        </View>

        {/* Title and Description */}
        <View>
          <Text
            className="mb-5 mt-8 w-[70%]"
            style={{
              fontFamily: "RobotoSemiBold",
              fontSize: 28,
              lineHeight: 32,
            }}
          >
            Any ingredient to avoid?
          </Text>
          <Text
            className="w-[78%] text-[15px] mb-5"
            style={{
              color: Colors.text.subColor,
              letterSpacing: 0.25,
              lineHeight: 20,
            }}
          >
            Tell us if there are any ingredients you'd like to avoid, and we'll
            tailor your meal plan accordingly.
          </Text>
        </View>

        {/* Suggestions */}
        <View className="mt-7 flex-1">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            {suggestions.map((item, idx) => (
              <View
                key={idx}
                className="px-6 py-2 rounded-full border"
                style={{ borderColor: Colors.text.faint }}
              >
                <Text className="text-sm" style={{ color: Colors.brand.base, fontSize: 13}}>
                  {item}
                </Text>
              </View>
            ))}
            <View
              className="px-6 py-2 rounded-full border"
              style={{ borderColor: Colors.text.faint }}
            >
              <Ionicons name="add" size={16} color={Colors.ui.base} />
            </View>
          </ScrollView>
        </View>

        {/* Next Button */}
        <Pressable
          className="py-3 rounded-xl mt-8 w-[30%] mb-12"
          style={{
            alignSelf: "flex-end",
            backgroundColor: Colors.ui.buttonFill,
          }}
        >
          <Text
            className="text-white text-center"
            style={{ fontFamily: "RobotoMedium" }}
          >
            Next
          </Text>
        </Pressable>
      </View>
    </>
  );
}
