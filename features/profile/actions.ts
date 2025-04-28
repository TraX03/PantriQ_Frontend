import { useState } from "react";

interface ProfileState {
  profileData: any;
  loading: boolean;
}

export function ProfileActions() {
  const [state, setState] = useState<ProfileState>({
    profileData: null,
    loading: false,
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
