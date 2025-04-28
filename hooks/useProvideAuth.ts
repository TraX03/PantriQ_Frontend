import { useEffect, useState, useCallback } from "react";
import { Models } from "react-native-appwrite";
import { account, databases } from "@/services/appwrite";
import { router } from "expo-router";
import reactotron from "reactotron-react-native";
import { appwriteConfig } from "@/constants/appwriteConfig";

export function useProvideAuth() {
  const [user, setUser] = useState<Models.User<{}> | null>(null);
  const [loading, setLoading] = useState(true);

  const handleError = (action: string, error: unknown) => {
    reactotron.log(`${action} failed:`, error);
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
      router.replace("/");
    } catch (error) {
      handleError("Login", error);
    }
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, username: string) => {
      try {
        await account.create("unique()", email, password);
        await account.createEmailPasswordSession(email, password);
        const currentUser = await account.get();
        setUser(currentUser);

        const userId = currentUser.$id;
        await databases.createDocument(
          appwriteConfig.DATABASE_ID,
          appwriteConfig.USERS_COLLECTION_ID,
          userId,
          {
            user_id: userId,
            username,
            joined_at: new Date().toISOString(),
          }
        );
      } catch (error) {
        handleError("SignUp", error);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      router.replace("/");
    } catch (error) {
      handleError("Logout", error);
    }
  }, []);

  return {
    user,
    loading,
    isLoggedIn: !!user,
    login,
    signUp,
    logout,
  };
}
