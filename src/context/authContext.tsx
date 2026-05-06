"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
interface AuthContextType {
  authUser: User | null;
  authToken: string | null;
  authSetToken: (newToken: string) => void;
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
  const loadUser = async (token: string) => {
    try {
      const res = await fetch(`/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch recent projects");
      const result = await res.json();
      console.log(result.data);
      setAuthUser(result.data);
    } catch (err) {
      console.error("Fetch user failed:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setAuthToken(storedToken);
      loadUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const authLogin = async (newToken: string) => {
    setLoading(true);

    const payload: any = jwtDecode(newToken);
    console.log(payload);
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

  async function authLogout() {
    try {
      setLoading(true);
      await fetch(`/api/user/me`);
      setAuthToken(null);
      setAuthUser(null);
      localStorage.removeItem("token");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  }

  function authSetToken(newToken: string) {
    setAuthToken(newToken);
    localStorage.setItem("token", newToken);
  }

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        authUser,
        authToken,
        authSetToken,
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
