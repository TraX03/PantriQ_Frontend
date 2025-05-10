import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { databases } from "@/services/appwrite";
import { Models, Query } from "react-native-appwrite";
import { ProfileData } from "@/redux/slices/profileSlice";
import { useFieldState } from "@/hooks/useFieldState";
import { useCallback, useEffect } from "react";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useProfileData } from "@/hooks/useProfileData";
import { useFocusEffect } from "expo-router";

export interface ProfileState {
  activeTab: "Posts" | "Collections" | "Likes";
  posts: Models.Document[];
  loading: boolean;
}

export const useProfileController = () => {
  const { fetchProfile } = useProfileData();
  const profileData = useSelector((state: RootState) => state.profile.userData);
  const isLoading = useSelector((state: RootState) => state.loading.loading);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const profile = useFieldState<ProfileState>({
    activeTab: "Posts",
    posts: [],
    loading: false,
  });

  const { setFieldState } = profile;

  useEffect(() => {
    fetchProfile();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (profileData) {
        fetchPostsByUser(profileData);
      }
    }, [profileData])
  );

  const fetchPostsByUser = async (profileData: ProfileData) => {
    if (!profileData?.id) return;

    setFieldState("loading", true);

    try {
      const response = await databases.listDocuments(
        AppwriteConfig.DATABASE_ID,
        AppwriteConfig.POSTS_COLLECTION_ID,
        [Query.equal("author_id", [profileData.id])]
      );

      setFieldState("posts", response.documents);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setFieldState("loading", false);
    }
  };

  return {
    profileData,
    isLoading,
    isLoggedIn,
    profile,
    fetchPostsByUser,
  };
};

export default useProfileController;
