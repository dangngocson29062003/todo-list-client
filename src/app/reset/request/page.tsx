"use client";
import { Button } from "@/src/components/shadcn/button";
import { Input } from "@/src/components/shadcn/input";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function RequestPage() {
  const [email, setEmail] = useState<string>();
  const [status, setStatus] = useState<"loading" | "success" | "error" | null>(
    null,
  );
  const handleSendMail = async () => {
    try {
      setStatus("loading");
      const res = await fetch(`/api/auth/forgot-password?email=${email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to verify");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-950 px-4">
      {status === "loading" && (
        <div className="flex flex-col items-center max-w-sm w-full animate-in fade-in zoom-in duration-500">
          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute w-18 h-18 border-4 border-transparent border-t-blue-600 border-r-blue-600 rounded-full animate-spin"></div>
            <Image
              src="/images/logo.png"
              alt="logo"
              width={32}
              height={32}
              className="animate-pulse"
            />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Sending reset link...
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm text-center">
              Please wait while we prepare your email.
            </p>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center max-w-sm w-full">
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute w-28 h-28 bg-green-400/50 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute w-24 h-24 border-2 border-green-500/50 rounded-full animate-ping opacity-30"></div>
            <Image
              src="/images/logo.png"
              alt="logo"
              width={32}
              height={32}
              className="animate-pulse"
            />
          </div>

          <h2 className="text-2xl font-bold text-green-600">
            Check your email
          </h2>

          <p className="text-sm text-gray-500 mt-2 text-center">
            We’ve sent a password reset link to
            <br />
            <span className="font-medium text-black dark:text-white">
              {email}
            </span>
          </p>
          <Link href="/login" className="w-full mt-4">
            <Button variant={"link"} className="w-full h-11 rounded-xl">
              Back to login
            </Button>
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center max-w-sm w-full animate-in fade-in zoom-in duration-500">
          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute w-28 h-28 bg-red-400/50 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute w-24 h-24 border-2 border-red-500/50 rounded-full animate-ping opacity-30"></div>
            <Image
              src="/images/logo.png"
              alt="logo"
              width={32}
              height={32}
              className="animate-pulse"
            />
          </div>

          <h2 className="text-2xl font-bold text-red-600">
            Something went wrong
          </h2>

          <p className="text-sm text-gray-500 leading-relaxed text-center">
            We couldn’t send the password reset email.
            <br />
            Please try again later.
          </p>
          <div className="flex flex-col gap-3 mt-6 w-full">
            <Button
              onClick={() => setStatus(null)}
              variant="outline"
              className="w-full h-11 rounded-xl"
            >
              Try again
            </Button>
          </div>
        </div>
      )}
      {status === null && (
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-xl p-8 space-y-6">
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
              Forgot password?
            </h2>
            <p className="text-sm text-gray-500">
              Enter your email address and we’ll send you a secure link to reset
              your password.
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
          </div>

          {/* Button */}
          <Button
            onClick={handleSendMail}
            className="w-full h-11 rounded-lg bg-black text-white hover:bg-gray-800"
          >
            Continue
          </Button>
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
              src={
                "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/500px-Google_%22G%22_logo.svg.png"
              }
              alt="logo-google"
              width={16}
              height={16}
            />
            <span className="text-sm">Continue with Google</span>
          </button>

          {/* Signup */}
          <p className="text-sm text-center text-gray-500">
            Never mind,{" "}
            <a
              href="/signup"
              className="text-black dark:text-white font-medium"
            >
              I remember now.
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
