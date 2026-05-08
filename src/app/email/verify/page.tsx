"use client";
import { Button } from "@/src/components/shadcn/button";
import { useAuthContext } from "@/src/context/authContext";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const searchParams = useSearchParams();
  const { authLogin } = useAuthContext();
  const router = useRouter();
  useEffect(() => {
    const token = searchParams.get("token");
    const verifyToken = async () => {
      if (!token) return setStatus("error");
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to verify");
        }
        const result = await res.json();
        const data = result.data;
        setStatus("success");
        setTimeout(() => {
          authLogin(data.accessToken);
          router.replace("/home");
        }, 1000);
      } catch (err) {
        setStatus((prev) => (prev === "success" ? "success" : "error"));
      }
    };
    verifyToken();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
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
              Verifying Identity
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              We're securely authenticating your email...
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
            Verified Successfully
          </h2>

          <p className="text-sm text-gray-500 mt-2">Redirecting to home...</p>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center max-w-sm w-full animate-in fade-in zoom-in duration-500">
          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute w-28 h-28 bg-red-400/50 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute w-24 h-24 border-2 border-red-500/50 rounded-full animate-ping opacity-30"></div>
            {/* LOGO */}
            <Image
              src="/images/logo.png"
              alt="logo"
              width={32}
              height={32}
              className="animate-pulse"
            />
          </div>

          <h2 className="text-2xl font-bold text-red-600">
            Verification Failed
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center max-w-[260px]">
            This verification link is invalid or has expired.
          </p>
          <div className="flex flex-col gap-3 mt-6 w-full">
            <Button>
              <Link href={"/login"}>Back to Login</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
