"use client";

import { useNotifyContext } from "@/src/components/notification/notificationProvider";
import { Button } from "@/src/components/shadcn/button";
import { Input } from "@/src/components/shadcn/input";
import { getErrorMessage } from "@/src/utils/helpers";
import { Lock, LockKeyhole, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const GOOGLE_OAUTH_URL = "http://localhost:8080/oauth2/authorization/google";

export default function SignupPage() {
  const router = useRouter();
  const notify = useNotifyContext();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    rePassword: "",
  });

  const { email, password, rePassword } = form;

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
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
        "Password must be at least 8 characters",
      );
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (loading || !validate()) return;

    try {
      setLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Failed to register");
      }

      notify("success", "Registration successful", "Please verify your email.");
      router.push("/email/notice");
    } catch (err) {
      notify("error", "Registration failed", getErrorMessage(err));
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
            Create your account
          </h2>

          <p className="text-sm text-gray-500">
            Start managing your projects today
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => updateField("email", e.target.value)}
              className="pl-10 h-11 rounded-lg"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => updateField("password", e.target.value)}
              className="pl-10 h-11 rounded-lg"
            />
          </div>

          <div className="relative">
            <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={rePassword}
              onChange={(e) => updateField("rePassword", e.target.value)}
              className="pl-10 h-11 rounded-lg"
            />
          </div>
        </div>

        {/* Submit */}
        <Button
          onClick={handleRegister}
          disabled={loading}
          className="w-full h-11"
        >
          {loading ? "Creating account..." : "Sign up"}
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
          variant="outline"
          className="w-full h-11"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/500px-Google_%22G%22_logo.svg.png"
            className="w-4 h-4"
            alt="google"
          />
          <span className="text-sm">Continue with Google</span>
        </Button>

        {/* Login link */}
        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-black dark:text-white font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
