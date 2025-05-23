import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "react-native-appwrite";

interface AuthState {
  user: Models.User<{}> | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Models.User<{}> | null>) {
      state.user = action.payload;
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
