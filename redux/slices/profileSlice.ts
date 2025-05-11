import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { storage } from "@/services/appwrite";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Gender = "Male" | "Female" | "Prefer not to say" | "Other";

export interface ProfileData {
  username: string;
  avatarUrl: string;
  bio?: string;
  gender?: Gender;
  birthday?: string;
  phone?: string;
  email?: string;
  followersCount: number;
  followingCount: number;
  profileBg?: string;
  id?: string;
}

export const guestPicture: string = "6820391600141fa25422";

export const guestProfile: ProfileData = {
  username: "Guest",
  avatarUrl: storage.getFileView(AppwriteConfig.BUCKET_ID, guestPicture).href,
  followersCount: 0,
  followingCount: 0,
};

interface ProfileState {
  userData: ProfileData;
}

const initialState: ProfileState = {
  userData: guestProfile,
};

export const userSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileData: (state, action: PayloadAction<ProfileData>) => {
      state.userData = action.payload;
    },
    resetProfileData: (state) => {
      state.userData = guestProfile;
    },
  },
});

export const { setProfileData, resetProfileData } = userSlice.actions;
export default userSlice.reducer;
