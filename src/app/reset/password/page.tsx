"use client";
import Image from "next/image";

import { Lock, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/src/components/shadcn/input";
import { Button } from "@/src/components/shadcn/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useNotifyContext } from "@/src/components/notification/notificationProvider";
import { getErrorMessage } from "@/src/utils/helpers";
export default function ResetPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const notify = useNotifyContext();
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) router.replace("/");
  }, [searchParams, router]);
  const validate = () => {
    if (!password.trim()) {
      notify("error", "Validation error", "Password is required");
      return false;
    }
    if (password.length < 8) {
      notify(
        "error",
        "Weak password",
        "Password must be at least 8 characters",
      );
      return false;
    }

    if (password !== confirmPassword) {
      notify("error", "Validation error", "Passwords do not match");
      return false;
    }
    return true;
  };
  const handleResetPassword = async () => {
    if (!validate()) return;
    const token = searchParams.get("token");
    const payload: any = {
      password,
    };
    try {
      const res = await fetch(`/api/auth/reset-password?token=${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to verify");
      }
      notify("success", "Reset password", "Your password has been reset");
      router.replace("/login");
    } catch (err) {
      notify("error", "Reset failed", getErrorMessage(err));
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>

              <Image
                src="/images/logo.png"
                alt="logo"
                width={40}
                height={40}
                className="relative animate-pulse"
              />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Reset password
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
              Create a new secure password for your account.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="password"
              placeholder="Enter new password"
              className="pl-10 h-11 rounded-xl border-gray-300 dark:border-zinc-700 
            focus:ring-2 focus:ring-black dark:focus:ring-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="relative">
            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <Input
              type="password"
              placeholder="Confirm new password"
              className="pl-10 h-11 rounded-xl border-gray-300 dark:border-zinc-700 
            focus:ring-2 focus:ring-black dark:focus:ring-white"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <Button
          onClick={handleResetPassword}
          className="w-full h-11 rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all"
        >
          Reset password
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Remember your password?{" "}
            <a
              href="/login"
              className="text-black dark:text-white font-medium hover:underline"
            >
              Back to login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
