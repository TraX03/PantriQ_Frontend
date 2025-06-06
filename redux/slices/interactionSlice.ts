import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InteractionState = {
  interactions: Map<string, any>;
  version: number;
};

const initialState: InteractionState = {
  interactions: new Map(),
  version: 0,
};

const interactionSlice = createSlice({
  name: "interaction",
  initialState,
  reducers: {
    setInteractionMap(state, action: PayloadAction<Map<string, any>>) {
      state.interactions = action.payload;
      state.version += 1;
    },
  },
});

export const { setInteractionMap } = interactionSlice.actions;

export default interactionSlice.reducer;
