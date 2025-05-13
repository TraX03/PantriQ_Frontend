import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { Models } from "react-native-appwrite";
import { ProfileData } from "@/redux/slices/profileSlice";
import { useFieldState } from "@/hooks/useFieldState";
import { useEffect } from "react";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useProfileData } from "@/hooks/useProfileData";
import { fetchAllDocuments, safeFetch } from "@/utility/fetchUtils";
import { setRefreshProfile } from "@/redux/slices/profileSlice";

export interface ProfileState {
  activeTab: "Posts" | "Collections" | "Likes";
  posts: Models.Document[];
  subTab: "Recipe" | "Tips" | "Discussion";
  postLoading: boolean;
}

export const useProfileController = () => {
  const { fetchProfile } = useProfileData();
  const dispatch = useDispatch<AppDispatch>();

  const { userData: profileData, refreshProfile } = useSelector(
    (state: RootState) => state.profile
  );
  const isLoading = useSelector((state: RootState) => state.loading.loading);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const profile = useFieldState<ProfileState>({
    activeTab: "Posts",
    posts: [],
    subTab: "Recipe",
    postLoading: false,
  });

  const { setFieldState } = profile;

  const fetchPostsByUser = async (user: ProfileData) => {
    if (!user?.id) return;

    setFieldState("postLoading", true);

    try {
      const [recipesRes, postsRes] = await Promise.all([
        safeFetch(() =>
          fetchAllDocuments(AppwriteConfig.RECIPES_COLLECTION_ID)
        ),
        safeFetch(() => fetchAllDocuments(AppwriteConfig.POSTS_COLLECTION_ID)),
      ]);

      const recipes = recipesRes
        .filter((doc) => doc.author_id === user.id)
        .map((doc) => ({ ...doc, type: "recipe" }));

      const tipsAndDiscussions = postsRes.filter(
        (doc) => doc.author_id === user.id
      );

      setFieldState("posts", [...recipes, ...tipsAndDiscussions]);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setFieldState("postLoading", false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profileData && profile.posts.length === 0) {
      fetchPostsByUser(profileData);
    }
  }, [profileData]);

  useEffect(() => {
    if (refreshProfile && profileData) {
      fetchPostsByUser(profileData);
      dispatch(setRefreshProfile(false));
    }
  }, [refreshProfile]);

  return {
    profileData,
    isLoading,
    isLoggedIn,
    profile,
    fetchPostsByUser,
  };
};

export default useProfileController;
