import { useState } from "react";
import HomeController from "./controller";
import HomeComponent from "./component";
import { HomeActions } from "../../features/home/actions";

const suggestions = ["Recipe", "Tips & Advice", "Communities", "Discussions"];

export default function HomeContainer() {
  const home = HomeActions();
  const filteredPosts = HomeController(home.activeSuggestion);

  return (
    <HomeComponent
      home={home}
      suggestions={suggestions}
      filteredPosts={filteredPosts}
    />
  );
}
