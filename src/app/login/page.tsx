"use client";

import { useState } from "react";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import { login } from "../../service/api";
import { useRouter } from "next/navigation";
import { useNotify } from "@/src/components/notification/notificationProvider";
import { getErrorMessage } from "@/src/utils/helpers";

export default function LoginPage() {
  const router = useRouter();
  const notify = useNotify();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);
      const res = await login(email, password, rememberMe);
      console.log("Login successful:", res);
      notify("success", "Login successful");
      localStorage.setItem("token", res.data);
      router.push("/landing");
    } catch (err) {
      console.error("Login failed:", err);
      notify("error", "Login failed", getErrorMessage(err));
    }
    finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center
    bg-gray-100 dark:bg-zinc-900 transition-colors">

      <div className="flex flex-col gap-4 relative w-100 mx-auto
      border border-gray-200 dark:border-zinc-700
      bg-white dark:bg-zinc-800
      shadow-2xl py-8 px-10 rounded-xl">

        {/* Back button */}
        <div className="absolute top-3 left-3">
          <ArrowLeft
            className="w-5 h-5 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-800 dark:hover:text-white"
            onClick={() => router.push("/landing")}
          />
        </div>

        {/* Title */}
        <div>
          <h2 className="text-lg font-semibold text-center text-gray-900 dark:text-gray-100">
            Sign in to Project Management
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
            Welcome back! Please sign in to continue
          </p>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-3 pt-2">

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />

            <input
              placeholder="Email"
              className="w-full h-11 border border-gray-300 dark:border-zinc-600
              bg-white dark:bg-zinc-900
              text-gray-900 dark:text-gray-100
              rounded-lg pl-10 pr-2 text-sm
              focus:outline-none focus:ring-1 focus:ring-gray-700 dark:focus:ring-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />

            <input
              type="password"
              placeholder="Password"
              className="w-full h-11 border border-gray-300 dark:border-zinc-600
              bg-white dark:bg-zinc-900
              text-gray-900 dark:text-gray-100
              rounded-lg pl-10 pr-2 text-sm
              focus:outline-none focus:ring-1 focus:ring-gray-700 dark:focus:ring-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Remember */}
          <div className="flex justify-between text-xs">
            <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                className="h-4 w-4"
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember me
            </label>

            <a href="#" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

        </div>

        {/* Login button */}
        <div className="pt-2">
          <button
            disabled={loading}
            onClick={handleLogin}
            className="w-full py-2
            bg-zinc-800 hover:bg-zinc-900
            dark:bg-white dark:text-black dark:hover:bg-gray-200
            text-white
            rounded-lg font-semibold
            transition-all duration-200 hover:shadow-md cursor-pointer"
          >
            {/* {loading ? "Signing in..." : "Login"} */}
            Login
          </button>
        </div>

        {/* Signup */}
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>

        {/* Divider */}
        <div>
          <hr className="border-gray-300 dark:border-zinc-700" />
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            Or connect with
          </p>
        </div>

        {/* Google login */}
        <div className="flex justify-center">
          <button
            onClick={() =>
            (window.location.href =
              "http://localhost:8080/oauth2/authorization/google")
            }
            className="flex items-center justify-center w-full h-9 text-sm gap-2
            text-gray-600 dark:text-gray-200
            bg-gray-100 dark:bg-zinc-700
            border border-gray-300 dark:border-zinc-600
            shadow shadow-gray-300 dark:shadow-none
            rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600
            transition-all duration-200 cursor-pointer"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/500px-Google_%22G%22_logo.svg.png"
              alt="Google"
              className="w-4 h-4"
            />
            Google
          </button>
        </div>

      </div>
    </div>
  );
}