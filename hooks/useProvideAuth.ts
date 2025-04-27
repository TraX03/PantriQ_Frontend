import { useEffect, useState } from "react";
import { Account, Models, Databases } from "react-native-appwrite";
import { client } from "@/services/appwrite";
import { router } from "expo-router";
import reactotron from "reactotron-react-native";
import { appwriteConfig } from "@/constants/appwriteConfig";

const account = new Account(client);
const databases = new Databases(client);

export function useProvideAuth() {
  const [user, setUser] = useState<Models.User<{}> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
      router.replace("/");
    } catch (error) {
      reactotron.log("Login failed:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
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
          username: username,
          joined_at: new Date().toISOString(),
        }
      );
    } catch (error) {
      reactotron.log("SignUp failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      router.replace("/");
    } catch (error) {
      reactotron.log("Logout failed:", error);
    }
  };

  return {
    user,
    loading,
    isLoggedIn: !!user,
    login,
    signUp,
    logout,
  };
}
