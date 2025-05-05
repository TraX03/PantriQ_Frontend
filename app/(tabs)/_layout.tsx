import React from "react";
import { Tabs } from "expo-router";
import { Pressable, View, StyleSheet } from "react-native";

import { IconSymbol } from "@/components/ui/IconSymbol";
import FloatingAddButton from "@/components/FloatingAddButton";
import { Colors } from "@/constants/Colors";
import { TabConfig } from "@/constants/TabConfig";
import { useRequireLogin } from "@/hooks/useRequireLogin";

export default function TabLayout() {
  const { checkLogin } = useRequireLogin();

  const renderTabScreen = (tab: any, index: number) => {
    const { name, hidden, icon, iconFocused, title } = tab;

    if (hidden) {
      // For hidden tabs, use them as placeholders for the floating button
      return (
        <Tabs.Screen
          key={index}
          name={name}
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
        name={name}
        options={{
          title,
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              name={focused ? iconFocused ?? icon! : icon!}
              color={color}
              selectedIcon={
                icon === "list.bullet" ? (focused ? 1 : 0) : undefined
              }
            />
          ),
        }}
      />
    );
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.brand.main,
          tabBarInactiveTintColor: Colors.ui.inactive,
          headerShown: false,
          tabBarButton: (props) => (
            <Pressable
              {...(props as React.ComponentProps<typeof Pressable>)}
              android_ripple={undefined}
            />
          ),
          tabBarLabelStyle: {
            fontFamily: "RobotoSemiCondensed",
            fontSize: 13,
          },
          tabBarStyle: {
            height: 60,
            backgroundColor: Colors.brand.accent,
          },
        }}
      >
        {TabConfig.map(renderTabScreen)}
      </Tabs>

      <View style={styles.dent} />

      <FloatingAddButton
        onPress={() =>
          checkLogin(() => {
            // Proceed with add action or nothing
          })
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  dent: {
    position: "absolute",
    alignSelf: "center",
    bottom: 22,
    width: 85,
    height: 37,
    backgroundColor: Colors.ui.background,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    zIndex: 1,
  },
});
