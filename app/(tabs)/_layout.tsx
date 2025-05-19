import BottomSheetModal from "@/components/BottomSheetModal";
import FloatingAddButton from "@/components/FloatingAddButton";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { TabConfig } from "@/constants/TabConfig";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import { router, Tabs } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function TabLayout() {
  const { checkLogin } = useRequireLogin();
  const [showModal, setShowModal] = useState(false);

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
          tabBarStyle: {
            height: 60,
            zIndex: 1,
          },
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
        onPress={() => checkLogin(() => setShowModal((prev) => !prev))}
      />

      <BottomSheetModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        options={[
          {
            key: "recipe",
            label: "Create new recipe",
            onPress: () => {
              setShowModal(false);
              router.push("/create/recipe");
            },
          },
          {
            key: "tips",
            label: "Create new post",
            onPress: () => {
              setShowModal(false);
              router.push("/create/tips");
            },
          },
          {
            key: "community",
            label: "Create new community",
            onPress: () => {
              setShowModal(false);
              router.push("/create/community");
            },
          },
        ]}
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
