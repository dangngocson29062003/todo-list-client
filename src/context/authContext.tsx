"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../service/api";


interface User {
  id: string;
  email: string;
  fullName: string;
  nickname: string;
  phone: string;
  address: string;
  avatarUrl: string;
  exp: number;
}

interface AuthContextType {
  authUser: User | null;
  authToken: string | null;
  authLogin: (newToken: string, user: User) => void;
  authLogout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setAuthToken(storedToken);
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchUserData() {
    try {
      const user = await getMe();
      // console.log(user)
      setAuthUser(user);
    } catch {
      setAuthUser(null);
      setAuthToken(null);
    } finally {
      setLoading(false);
    }
  }

  function authLogin(newToken: string, user: User) {
    setAuthToken(newToken);
    setAuthUser(user);
    localStorage.setItem("token", newToken);
  }

  function authLogout() {
    setAuthToken(null);
    setAuthUser(null);
    localStorage.removeItem("token");
  }

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{ authUser, authToken, authLogin, authLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
