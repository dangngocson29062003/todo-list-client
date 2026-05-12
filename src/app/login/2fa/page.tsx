"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/src/components/shadcn/input-otp";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useNotifyContext } from "@/src/components/notification/notificationProvider";
import { Button } from "@/src/components/shadcn/button";
import { useAuthContext } from "@/src/context/authContext";
import { getErrorMessage } from "@/src/utils/helpers";

import VerifyBackupCodeDialog from "@/src/components/dashboard/settings/verify-backup-dialog";
import { Avatar, AvatarFallback } from "@/src/components/shadcn/avatar";
import Image from "next/image";

export default function OtpPage() {
  const router = useRouter();
  const notify = useNotifyContext();
  const { authLogin, authUser, authToken, authSetUser } = useAuthContext();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [openBackupDialog, setOpenBackupDialog] = useState(false);

  useEffect(() => {
    if (authToken && authUser) {
      router.replace("/home");
    }
  }, [authToken, authUser, router]);

  const verifyOtp = async () => {
    if (otp.length !== 6 || loading) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/auth/2fa?otp=${otp}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || "Invalid verification code");
      }

      authLogin(result.data.accessToken);

      notify(
        "success",
        "Verification successful",
        "You have been signed in successfully.",
      );

      router.replace("/home");
    } catch (err) {
      notify("error", "Verification failed", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const verifyBackupCode = async (code: string) => {
    if (backupLoading) return;

    try {
      setBackupLoading(true);

      const res = await fetch(
        `/api/auth/2fa/verify-backup?backupCode=${code}`,
        { method: "POST" },
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Invalid backup code");
      }

      authLogin(result.data.accessToken);

      notify("success", "Success", "Logged in using backup code.");

      router.replace("/home");
    } catch (err) {
      notify("error", "Failed", getErrorMessage(err));
    } finally {
      setBackupLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-950 px-4">
      <div className="w-full max-w-md p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-5">
          <Image
            src="/images/logo.png"
            alt="logo"
            width={32}
            height={32}
            className="animate-pulse mb-2"
          />

          <div className="flex flex-col items-center space-y-4 text-center">
            <Avatar className="h-16 w-16 hover:scale-105 transition">
              <AvatarFallback className="text-xl">
                {authUser?.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight">
                Verify your identity
              </h2>
              <p className="text-xs text-muted-foreground">{authUser?.email}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code from your authenticator app.
            </p>
          </div>

          {/* OTP Input */}
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
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

          {/* Backup codes */}
          <p className="text-xs text-center text-muted-foreground leading-none">
            Lost your device? Use{" "}
            <Button
              variant="link"
              className="text-primary font-medium h-auto p-0 text-xs"
              onClick={() => setOpenBackupDialog(true)}
            >
              backup codes
            </Button>
          </p>

          {/* Submit */}
          <Button
            className="w-full h-11 rounded-xl"
            disabled={otp.length !== 6 || loading}
            onClick={verifyOtp}
          >
            {loading ? "Verifying..." : "Verify"}
          </Button>
          <button
            className="text-sm text-sm text-center text-gray-500 hover:text-primary transition-colors font-medium cursor-pointer"
            onClick={() => {
              authSetUser(null);
              router.replace("/login");
            }}
          >
            Log in with another account
          </button>
        </div>
      </div>

      {/* Backup dialog */}
      <VerifyBackupCodeDialog
        open={openBackupDialog}
        onOpenChange={setOpenBackupDialog}
        loading={backupLoading}
        onVerify={verifyBackupCode}
      />
    </div>
  );
}
