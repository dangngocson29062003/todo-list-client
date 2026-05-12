"use client";

import { useNotifyContext } from "@/src/components/notification/notificationProvider";
import { Button } from "@/src/components/shadcn/button";
import { Input } from "@/src/components/shadcn/input";
import { useAuthContext } from "@/src/context/authContext";
import { getErrorMessage } from "@/src/utils/helpers";
import { Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const GOOGLE_OAUTH_URL = "http://localhost:8080/oauth2/authorization/google";

export default function LoginPage() {
  const router = useRouter();
  const notify = useNotifyContext();
  const { authLogin, authToken, authUser, authSetUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data;
      if (data?.type !== "AUTH_SUCCESS") return;
      notify("success", "Login Successful", "Welcome back!");
      authLogin(data.token);
      router.push("/home");
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [authLogin, notify, router]);

  useEffect(() => {
    if (authToken && authUser) {
      router.push("/home");
    }
  }, [authUser, authToken, router]);

  const handleLogin = async () => {
    if (!email || !password) {
      notify("error", "Validation error", "Email and password are required");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result?.error || "Failed to login");
      }
      const data = result.data;
      if (data.twoFAToken) {
        authSetUser({ email: email } as User);
        notify(
          "info",
          "Two-factor authentication",
          "Enter the verification code from your authenticator app.",
        );
        router.push("/login/2fa");
        return;
      }
      authLogin(data.accessToken);
    } catch (err) {
      notify("error", "Login failed", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useCallback(() => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    window.open(
      GOOGLE_OAUTH_URL,
      "google-login",
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`,
    );
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-950 px-4">
      <div className="w-full max-w-md p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Image
              src="/images/logo.png"
              alt="logo"
              width={32}
              height={32}
              className="animate-pulse"
            />
          </div>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Welcome back
          </h2>
          <p className="text-sm text-gray-500">
            Sign in to your account to continue
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Email"
              className="pl-10 h-11 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="password"
              placeholder="Password"
              className="pl-10 h-11 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-end text-xs">
            <Link href="/reset/request" className="text-gray-500">
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Login */}
        <Button
          disabled={loading}
          onClick={handleLogin}
          className="w-full h-11"
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-700" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-700" />
        </div>

        {/* Google */}
        <Button
          onClick={handleGoogleLogin}
          variant={"outline"}
          className="w-full h-11"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/500px-Google_%22G%22_logo.svg.png"
            className="w-4 h-4"
          />
          <span className="text-sm">Continue with Google</span>
        </Button>

        {/* Signup */}
        <p className="text-sm text-center text-gray-500">
          New user?{" "}
          <Link
            href="/signup"
            className="font-medium text-black dark:text-white"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
