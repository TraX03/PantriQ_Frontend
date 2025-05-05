import { useState } from "react";

export function useFieldState<T extends object>(initialState: T) {
  const [state, setState] = useState<T>(initialState);

  const setFieldState = <K extends keyof T>(field: K, value: T[K]) => {
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