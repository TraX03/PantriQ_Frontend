import React, { useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import EditFieldController from "./controller";
import EditFieldComponent from "./component";
import { useFieldState } from "@/hooks/useFieldState";

const fieldLabels: Record<string, string> = {
  username: "Username",
  bio: "Bio",
  gender: "Gender",
  birthday: "Birthday",
  phone: "Phone Number",
  email: "Email",
};

export default function EditFieldContainer() {
  const { key, size, data } = useLocalSearchParams<{
    key: string;
    size: string;
    data: string;
  }>();

  const profile = useMemo(() => {
    try {
      return JSON.parse(decodeURIComponent(data || "{}")) as Record<
        string,
        string
      >;
    } catch {
      return {};
    }
  }, [data]);

  const label = fieldLabels[key] || "Unknown Field";
  const initialValue = profile[key] || "";
  const maxLength = size ? parseInt(size) : undefined;

  const edit = useFieldState({
    value: initialValue,
    showDatePicker: false,
  });

  const controller = EditFieldController({ key, label, edit });

  return (
    <EditFieldComponent
      keyName={key}
      label={label}
      maxLength={maxLength}
      {...controller}
    />
  );
}
