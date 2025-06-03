import { useProfileData } from "@/hooks/useProfileData";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import { setRefreshProfile } from "@/redux/slices/profileSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileComponent from "./component";
import { useProfileController } from "./controller";

type Props = {
  profileId?: string;
};

export default function ProfileContainer({ profileId }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { checkLogin } = useRequireLogin();
  const { fetchProfile, getUserProfileData } = useProfileData();
  const {
    profile,
    fetchPostsByUser,
    fetchFollowInteraction,
    isBackgroundDark,
  } = useProfileController();

  const { userData: currentUserProfile, refreshProfile } = useSelector(
    (state: RootState) => state.profile
  );
  const { loading: isLoading } = useSelector(
    (state: RootState) => state.loading
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const currentUserId = currentUserProfile?.id;
  const isLoggedIn = Boolean(user);
  const isOwnProfile = profileId === currentUserId || !profileId;

  useEffect(() => {
    if (isOwnProfile) {
      fetchProfile();
    } else if (profileId) {
      getUserProfileData(profileId).then((data) => {
        profile.setFieldState("viewedProfileData", data);
        fetchPostsByUser(profileId);
        if (user?.$id) {
          fetchFollowInteraction(profileId, user.$id);
        }
      });
    }
  }, [profileId, isOwnProfile]);

  useEffect(() => {
    if (isOwnProfile && currentUserId && profile.posts.length === 0) {
      fetchPostsByUser(currentUserId);
    }
  }, [isOwnProfile, currentUserId, profile.posts.length]);

  useEffect(() => {
    if (isOwnProfile && refreshProfile && currentUserId) {
      fetchPostsByUser(currentUserId);
      dispatch(setRefreshProfile(false));
    }
  }, [refreshProfile, isOwnProfile, currentUserId]);

  const profileData = isOwnProfile
    ? currentUserProfile
    : profile.viewedProfileData;

  return (
    <ProfileComponent
      profileData={profileData}
      isLoading={isLoading}
      isLoggedIn={isLoggedIn}
      checkLogin={checkLogin}
      profile={profile}
      isOwnProfile={isOwnProfile}
      isBackgroundDark={isBackgroundDark}
    />
  );
}
