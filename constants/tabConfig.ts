import React from "react";
import { IconSymbolName } from "@/components/ui/IconSymbol";

export type TabConfig = {
  name: string;
  title?: string;
  icon?: IconSymbolName;
  iconFocused?: IconSymbolName;
  hidden?: boolean;
};

export const tabConfig: TabConfig[] = [
  {
    name: "index",
    title: "Home",
    icon: "house",
    iconFocused: "house.fill",
  },
  {
    name: "planner",
    title: "Planner",
    icon: "calendar.circle",
    iconFocused: "calendar.circle.fill",
  },
  {
    name: "_add",
    hidden: true,
  },
  {
    name: "lists",
    title: "Lists",
    icon: "list.bullet",
  },
  {
    name: "profile",
    title: "Profile",
    icon: "person",
    iconFocused: "person.fill",
  },
];
