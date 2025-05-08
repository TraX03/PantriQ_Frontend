import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import CreateFormController from "./controller";
import CreateFormComponent, { CreateFormState } from "./component";
import { useFieldState } from "@/hooks/useFieldState";

export default function CreateFormContainer() {
  const dispatch = useDispatch<AppDispatch>();

  const create = useFieldState<CreateFormState>({
    title: "",
    content: "",
    images: [],
    postType: "discussion",
  });

  const pickImage = () => {
    return CreateFormController.handlePickImage(create.images, (imgs) => {
      create.setFieldState("images", imgs);
    })();
  };

  const submitForm = () => CreateFormController.handleSubmit(dispatch, create);

  return (
    <CreateFormComponent
      create={create}
      handlePickImage={pickImage}
      handleSubmit={submitForm}
    />
  );
}
