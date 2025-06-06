import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import interactionReducer from "./slices/interactionSlice";
import loadingReducer from "./slices/loadingSlice";
import profileReducer from "./slices/profileSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    profile: profileReducer,
    interaction: interactionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
