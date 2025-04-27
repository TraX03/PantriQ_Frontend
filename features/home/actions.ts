import { useState } from "react";

export function HomeActions() {
  const [state, setState] = useState({
    activeTab: "Explore",
    activeSuggestion: "Recipe",
  });

  const setFieldState = (field: keyof typeof state, value: any) => {
    setState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    ...state,
    setFieldState,
  };
}

