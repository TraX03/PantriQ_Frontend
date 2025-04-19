import React from "react";
import HomeView from "@/app/Home/component";

if (__DEV__) {
  require("@/ReactotronConfig");
}

export default function HomePage() {
  return <HomeView />;
};
