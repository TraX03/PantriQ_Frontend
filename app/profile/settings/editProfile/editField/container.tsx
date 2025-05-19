import { useLocalSearchParams } from "expo-router";
import React from "react";
import EditFieldComponent from "./component";
import { useEditFieldController } from "./controller";

export default function EditFieldContainer() {
  const {
    key = "",
    size = "",
    data = "",
  } = useLocalSearchParams<{
    key: string;
    size: string;
    data: string;
  }>();

  const maxLength = size ? parseInt(size) : undefined;

  const controller = useEditFieldController(key, data, maxLength);

  return <EditFieldComponent {...controller} />;
}
