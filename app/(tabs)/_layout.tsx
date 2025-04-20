import React from "react";
import { Tabs } from "expo-router";
import { Pressable, View, StyleSheet } from "react-native";

import { IconSymbol } from "@/components/ui/IconSymbol";
import FloatingAddButton from "@/components/FloatingAddButton";
import { Colors } from "@/constants/Colors";
import { tabConfig } from "@/constants/tabConfig";

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.tabIconDefault,
          headerShown: false,
          tabBarButton: (props) => (
            <Pressable {...props} android_ripple={null} />
          ),
          tabBarLabelStyle: {
            fontFamily: "SFProDisplay",
            fontSize: 13,
          },
          tabBarStyle: {
            height: 60,
          },
        }}
      >
        {tabConfig.map((tab, index) => {
          if (tab.hidden) {
            // Hidden tab used as a placeholder for the center floating Add button
            return (
              <Tabs.Screen
                key={index}
                name={tab.name}
                options={{
                  tabBarButton: () => null,
                  tabBarStyle: { display: "none" },
                }}
              />
            );
          }

          return (
            <Tabs.Screen
              key={index}
              name={tab.name}
              options={{
                title: tab.title,
                tabBarIcon: ({ color, focused }) => (
                  <IconSymbol
                    name={focused ? tab.iconFocused ?? tab.icon! : tab.icon!}
                    color={color}
                    selectedIcon={
                      tab.icon === "list.bullet" ? (focused ? 1 : 0) : undefined
                    }
                  />
                ),
              }}
            />
          );
        })}
      </Tabs>

      {/* Nav Bar Dent */}
      <View style={styles.dent} />
      <FloatingAddButton />
    </>
  );
}

const styles = StyleSheet.create({
  dent: {
    position: "absolute",
    alignSelf: "center",
    bottom: 20,
    width: 90,
    height: 40,
    backgroundColor: Colors.background,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    zIndex: 1,
  },
});
