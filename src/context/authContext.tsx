"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
interface AuthContextType {
  authUser: User | null;
  authToken: string | null;
  authSetToken: (newToken: string) => void;
  authSetUser: (user: User | null) => void;
  authLogin: (newToken: string) => void;
  authLogout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
          setLoading(false);
          return;
        }
        setAuthToken(storedToken);
        try {
          await loadUser(storedToken);
        } catch {
          const newAccessToken = await refreshAccessToken();
          if (!newAccessToken) {
            return;
          }
          await loadUser(newAccessToken);
        }
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);
  const loadUser = async (token: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch recent projects");
      const result = await res.json();
      console.log(result.data);
      setAuthUser(result.data);
    } catch (err) {
      console.error("Fetch user failed:", err);
      localStorage.removeItem("token");
      setAuthToken(null);
      setAuthUser(null);
    } finally {
      setLoading(false);
    }
  };
  const authLogin = async (newToken: string) => {
    setLoading(true);
    const payload: any = jwtDecode(newToken);
    if (!payload.verified) {
      localStorage.setItem("token", newToken);
      setAuthToken(newToken);
      setLoading(false);
      router.replace("/email/notice");
      return;
    }
    localStorage.setItem("token", newToken);
    setAuthToken(newToken);
    await loadUser(newToken);
    setLoading(false);
  };
  const refreshAccessToken = async () => {
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Refresh failed");
      }

      const result = await res.json();
      localStorage.setItem("token", result.data.accessToken);
      setAuthToken(result.data.accessToken);
      return result.data.accessToken;
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
      setAuthToken(null);
      setAuthUser(null);
      return null;
    }
  };
  async function authLogout() {
    if (!authToken || loading) return;
    try {
      setLoading(true);
      await fetch(`/api/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setAuthToken(null);
      setAuthUser(null);
      localStorage.removeItem("token");
      setLoading(false);
      router.push("/login");
    }
  }
  function authSetToken(newToken: string) {
    setAuthToken(newToken);
    localStorage.setItem("token", newToken);
  }
  const authSetUser = (user: User | null) => {
    setAuthUser(user);
  };
  if (loading) return null;
  return (
    <AuthContext.Provider
      value={{
        authUser,
        authToken,
        authSetToken,
        authSetUser,
        authLogin,
        authLogout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
