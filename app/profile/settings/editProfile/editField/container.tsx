import React, { useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import EditFieldController from "./controller";
import EditFieldComponent from "./component";
import { useFieldState } from "@/hooks/useFieldState";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useProfileData } from "@/hooks/useProfileData";

const fieldLabels: Record<string, string> = {
  username: "Username",
  bio: "Bio",
  gender: "Gender",
  birthday: "Birthday",
  phone: "Phone Number",
  email: "Email",
};

export default function EditFieldContainer() {
  const dispatch = useDispatch<AppDispatch>();
  const { fetchProfile } = useProfileData();

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

  const controller = {
    value: edit.value,
    setValue: (newValue: string) => {
      edit.setFieldState("value", newValue);
    },
    handleSave: () => {
      EditFieldController.handleSave(
        key,
        edit.value,
        label,
        dispatch,
        fetchProfile
      );
    },
    showDatePicker: edit.showDatePicker,
    toggleDatePicker: (isVisible: boolean) => {
      edit.setFieldState("showDatePicker", isVisible);
    },
  };

  return (
    <EditFieldComponent
      keyName={key}
      label={label}
      maxLength={maxLength}
      {...controller}
    />
  );
}
