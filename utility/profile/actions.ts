import { useState } from "react";

interface ProfileState {
  profileData: any;
}

export function ProfileActions() {
  const [state, setState] = useState<ProfileState>({
    profileData: null,
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
