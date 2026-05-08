"use client";
import { useAuthContext } from "@/src/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function LogoutPage() {
  const router = useRouter();
  const { authLogout } = useAuthContext();
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await authLogout();
      } catch (e) {
        console.error("Logout failed", e);
      } finally {
        router.push("/");
      }
    };
    handleLogout();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
