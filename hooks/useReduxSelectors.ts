import { RootState } from "@/redux/store";
import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const selectAuth = (state: RootState) => state.auth;
const selectInteraction = (state: RootState) => state.interaction;
const selectProfile = (state: RootState) => state.profile;
const selectLoading = (state: RootState) => state.loading;

const selectReduxData = createSelector(
  [selectAuth, selectInteraction, selectProfile, selectLoading],
  (auth, interaction, profile, loading) => ({
    isLoggedIn: !!auth.user,
    user: auth.user,
    interactionMap: interaction.interactions,
    interactionVersion: interaction.version,
    currentUserId: profile.userData?.id,
    currentUserProfile: profile.userData,
    refreshProfile: profile.refreshProfile,
    loading: loading.loading,
  })
);

export function useReduxSelectors() {
  return useSelector(selectReduxData);
}
