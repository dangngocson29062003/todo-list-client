"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/src/components/shadcn/input-otp";
import { useEffect, useState } from "react";

import { useNotifyContext } from "@/src/components/notification/notificationProvider";
import { Button } from "@/src/components/shadcn/button";
import { useAuthContext } from "@/src/context/authContext";
import { getErrorMessage } from "@/src/utils/helpers";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function OtpPage() {
  const { authLogin, authUser, authToken } = useAuthContext();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const notify = useNotifyContext();
  const router = useRouter();
  useEffect(() => {
    if (authToken && authUser) {
      router.push("/home");
    }
  }, [authToken, authUser]);
  async function handleVerifyOTP() {
    try {
      setLoading(true);
      const res = await fetch(`/api/auth/2fa?otp=${otp}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Invalid verification code");
      }

      const result = await res.json();
      const data = result.data;
      authLogin(data.accessToken);
      notify(
        "success",
        "Verification successful",
        "You have been signed in successfully.",
      );
    } catch (err) {
      notify("error", "Verification failed", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-950 px-4">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="p-8">
          <div className="flex flex-col items-center gap-5">
            <div className="flex justify-center">
              <Image
                src="/images/logo.png"
                alt="logo"
                width={32}
                height={32}
                className="animate-pulse"
              />
            </div>

            <div className="text-center">
              <h2 className="text-xl font-semibold tracking-tight">
                Two-factor authentication
              </h2>

              <p className="text-sm text-muted-foreground mt-1 max-w-[320px]">
                Enter the 6-digit code from your authenticator app.
              </p>
            </div>

            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="w-12 h-12" />
                <InputOTPSlot index={1} className="w-12 h-12" />
                <InputOTPSlot index={2} className="w-12 h-12" />
              </InputOTPGroup>

              <InputOTPSeparator />

              <InputOTPGroup>
                <InputOTPSlot index={3} className="w-12 h-12" />
                <InputOTPSlot index={4} className="w-12 h-12" />
                <InputOTPSlot index={5} className="w-12 h-12" />
              </InputOTPGroup>
            </InputOTP>
            <Button
              className="w-full h-11 rounded-xl"
              disabled={otp.length !== 6 || loading}
              onClick={handleVerifyOTP}
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
