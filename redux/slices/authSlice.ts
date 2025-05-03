import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "react-native-appwrite";

interface AuthState {
  user: Models.User<{}> | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Models.User<{}> | null>) {
      state.user = action.payload;
      state.isLoggedIn = action.payload !== null;
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
