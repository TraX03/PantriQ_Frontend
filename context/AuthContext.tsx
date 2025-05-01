import { createContext, useContext } from "react";
import { Models } from "react-native-appwrite";
import { useProvideAuth } from "@/hooks/useProvideAuth";

type AuthContextType = {
  user: Models.User<{}> | null;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useProvideAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
