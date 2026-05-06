"use client";

import { useNotifyContext } from "@/src/components/notification/notificationProvider";
import { Input } from "@/src/components/shadcn/input";
import { getErrorMessage } from "@/src/utils/helpers";
import { Lock, LockKeyhole, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const notify = useNotifyContext();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  async function handleRegister() {
    if (loading || !validate()) return;
    try {
      setLoading(true);
      const payload = {
        email,
        password,
      };
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to register");
      }
      const result = await res.json();
      notify("success", "Registration successful. Please verify your email.");
      router.push("/email/notice");
    } catch (err) {
      notify("error", "Registration failed", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }
  function validate() {
    if (!email || !password) {
      notify(
        "error",
        "Registration failed",
        "Email and password cannot be empty",
      );
      return false;
    }
    if (password !== rePassword) {
      notify("error", "Registration failed", "Passwords do not match");
      return false;
    }
    if (password.length < 6) {
      notify(
        "error",
        "Registration failed",
        "Password must be at least 6 characters",
      );
      return false;
    }
    return true;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-xl p-8 space-y-6 relative">
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
            Create your account
          </h2>
          <p className="text-sm text-gray-500">
            Start managing your projects today
          </p>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Email"
              className="pl-10 h-11 rounded-lg border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-black dark:focus:ring-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
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
          <div className="relative">
            <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="password"
              placeholder="Confirm Password"
              className="pl-10 h-11 rounded-lg border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-black dark:focus:ring-white"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={handleRegister}
          className="w-full h-11 rounded-lg bg-black text-white hover:bg-gray-800 transition"
        >
          Sign up
        </button>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-700"></div>
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-700"></div>
        </div>
        <button
          onClick={() =>
            (window.location.href =
              "http://localhost:8080/oauth2/authorization/google")
          }
          className="flex items-center justify-center gap-2 w-full h-11 rounded-lg border border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/500px-Google_%22G%22_logo.svg.png"
            className="w-4 h-4"
          />
          <span className="text-sm">Continue with Google</span>
        </button>
        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-black dark:text-white font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
