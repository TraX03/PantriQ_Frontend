import React from "react";
import CreateFormComponent from "./component";
import { useCreateFormController } from "./controller";

export default function CreateFormContainer() {
  const { create, controller } = useCreateFormController();

  return <CreateFormComponent create={create} controller={controller} />;
}
