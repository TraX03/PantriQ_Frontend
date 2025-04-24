import { createContext, useContext, useEffect, useState } from "react";
import { Account, Models } from "react-native-appwrite";
import { client } from "@/services/appwrite";
import { router } from "expo-router";
import reactotron from "reactotron-react-native";

const account = new Account(client);

type AuthContextType = {
  user: Models.User<{}> | null;
  isLoggedIn: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>; // NEW
};

// Provide default context value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Models.User<{}> | null>(null);
  const [loading, setLoading] = useState(true);

  // Check current session on mount
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
      router.replace("/"); // Navigate to app home after login
    } catch (error) {
      reactotron.log("Login failed:", error);
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

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, loading, logout, login }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
