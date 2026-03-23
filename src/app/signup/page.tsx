"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Lock, LockIcon, LockKeyhole, Mail } from "lucide-react";
import { register } from "@/src/service/auth-service";
import { useRouter } from "next/navigation";
import { useNotifyContext } from "@/src/components/notification/notificationProvider";
import { getErrorMessage } from "@/src/utils/helpers";

export default function SignupPage() {
  const router = useRouter();
  const notify = useNotifyContext();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  async function handleRegister() {
    validate();
    try {
      setLoading(true);
      const data = await register(email, password);
      console.log("Registration successful:", data);
      router.push("/landing");
    } catch (err) {
      notify("error", "Registration failed", getErrorMessage(err));
    }finally {
      setLoading(false);
    }
  }
  function validate() {
    if (!email || !password) {
      notify("error", "Registration failed", "Email and password cannot be empty");
      throw new Error("Validation failed");
    }
    if (password !== rePassword) {
      notify("error", "Registration failed", "Passwords do not match");
      throw new Error("Validation failed");
    }
    if(password.length < 6) {
      notify("error", "Registration failed", "Password must be at least 6 characters");
      throw new Error("Validation failed");
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gray-100 dark:bg-zinc-900 transition-colors">
      <div className="flex flex-col gap-4 relative w-100 mx-auto 
      border border-gray-200 dark:border-zinc-700
      bg-white dark:bg-zinc-800
       shadow-2xl py-8 px-10 rounded-xl">
        <div className="absolute top-3 left-3">
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-800 dark:hover:text-white"
            onClick={() => router.push("/landing")} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-center">
            Create your account
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
            Sign up to start managing your projects
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">

          {/* Email input */}
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

          {/* Password input */}
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

          {/* Confirm Password input */}
          <div className="relative">
            <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full h-11 border border-gray-300 dark:border-zinc-600
              bg-white dark:bg-zinc-900
              text-gray-900 dark:text-gray-100
              rounded-lg pl-10 pr-2 text-sm
              focus:outline-none focus:ring-1 focus:ring-gray-700 dark:focus:ring-gray-400"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
            />
          </div>

        </div>

        <div className="pt-2">
          <button
            onClick={handleRegister}
            className="w-full py-2 bg-zinc-800 hover:bg-zinc-900
            dark:bg-white dark:text-black dark:hover:bg-gray-200
            text-white
            rounded-lg font-semibold
            transition-all duration-200 hover:shadow-md cursor-pointer">
            Signup
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </p>

        <div>
          <hr className="border-gray-300 dark:border-zinc-700" />
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            Or connect with
          </p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}
            className="flex items-center justify-center w-full h-9 text-sm text-gray-600 dark:text-gray-200 gap-2 bg-gray-100 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 shadow shadow-gray-300 dark:shadow-none rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 transition-all duration-200 cursor-pointer">
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