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
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const notify = useNotifyContext();
  const { authLogin, authUser, authToken } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    if (authToken && authUser) {
      router.push("/home");
    }
  }, [authToken, authUser]);
  async function handleLogin() {
    try {
      setLoading(true);
      const payload = {
        email,
        password,
      };
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();

        throw new Error(errorData.error || "Failed to login");
      }
      const result = await res.json();
      const data = result.data;
      if (data.twoFAToken) {
        router.push("/login/otp");
        notify(
          "info",
          "Two-factor authentication",
          "Enter the verification code from your authenticator app.",
        );
        return;
      }
      authLogin(data.accessToken);
    } catch (err) {
      console.error("Login failed:", err);
      notify("error", "Login failed", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-950 px-4">
      <div className="w-full max-w-md p-8 space-y-6">
        {/* Logo + Title */}
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

        {/* Form */}
        <div className="space-y-4">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Email"
              className="pl-10 h-11 rounded-lg border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-black dark:focus:ring-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="password"
              placeholder="Password"
              className="pl-10 h-11 rounded-lg border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-black dark:focus:ring-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Forgot */}
          <div className="flex justify-end text-xs">
            <Link
              href="/reset/request"
              className="text-gray-500 hover:text-black dark:hover:text-white"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Button */}
        <Button
          disabled={loading}
          onClick={handleLogin}
          className="w-full h-11 rounded-lg bg-black text-white hover:bg-gray-800"
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-700"></div>
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-700"></div>
        </div>

        {/* Google */}
        <button
          onClick={() =>
            (window.location.href =
              "http://localhost:8080/oauth2/authorization/google")
          }
          className="flex items-center justify-center gap-2 w-full h-11 rounded-lg border border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
        >
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/500px-Google_%22G%22_logo.svg.png"
            alt="logo-google"
            width={16}
            height={16}
          />
          <span className="text-sm">Continue with Google</span>
        </button>

        {/* Signup */}
        <p className="text-sm text-center text-gray-500">
          New user?{" "}
          <Link
            href="/signup"
            className="text-black dark:text-white font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
