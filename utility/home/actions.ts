import { useState } from "react";

interface HomeState {
  activeTab: string;
  activeSuggestion: string;
}

export function HomeActions() {
  const [state, setState] = useState<HomeState>({
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

