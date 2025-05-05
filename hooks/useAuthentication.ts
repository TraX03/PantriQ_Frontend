import { useEffect, useCallback } from "react";
import { account, databases } from "@/services/appwrite";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/authSlice";
import { router } from "expo-router";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { setLoading } from "@/redux/slices/loadingSlice";
import { AppDispatch } from "@/redux/store";
import { useProfileData } from "./useProfileData";

export function useAuthentication() {
  const dispatch = useDispatch<AppDispatch>();
  const { fetchProfile } = useProfileData();

  const handleError = (action: string, error: any) => {
    console.warn(`${action} failed:`, error);
    throw error;
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await account.get();
        dispatch(setUser(currentUser));
      } catch (error) {
        dispatch(setUser(null));
      }
    };

    checkSession();
  }, [dispatch]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await account.createEmailPasswordSession(email, password);
        dispatch(setLoading(true));
        const currentUser = await account.get();
        dispatch(setUser(currentUser));
        dispatch(setLoading(false));
        router.replace("/");
      } catch (error) {
        handleError("Login", error);
      }
    },
    [dispatch]
  );

  const signUp = useCallback(
    async (email: string, password: string, username: string) => {
      try {
        await account.create("unique()", email, password);
        await account.createEmailPasswordSession(email, password);
        dispatch(setLoading(true));
        const currentUser = await account.get();
        dispatch(setUser(currentUser));

        const userId = currentUser.$id;
        await databases.createDocument(
          AppwriteConfig.DATABASE_ID,
          AppwriteConfig.USERS_COLLECTION_ID,
          userId,
          {
            user_id: userId,
            username,
            joined_at: new Date().toISOString(),
          }
        );
        dispatch(setLoading(false));
      } catch (error) {
        handleError("SignUp", error);
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await account.deleteSession("current");
      dispatch(setUser(null));
      router.replace("/");
      fetchProfile();
    } catch (error) {
      handleError("Logout", error);
    }
  }, [dispatch]);

  return {
    login,
    signUp,
    logout,
  };
}
