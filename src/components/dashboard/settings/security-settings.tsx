"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Laptop,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import { Button } from "../../shadcn/button";
import { Switch } from "../../shadcn/switch";
import { Input } from "../../shadcn/input";

import { useAuthContext } from "@/src/context/authContext";
import { useNotifyContext } from "../../notification/notificationProvider";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../../shadcn/input-otp";
import BackupCodesDialog from "./backup-dialog";
import VerifyBackupCodeDialog from "./verify-backup-dialog";

export default function SecuritySettings() {
  const { authToken, authUser, authSetUser } = useAuthContext();
  const notify = useNotifyContext();
  const [mode, setMode] = useState<"enable" | "disable" | null>(null);
  const [enabled2FA, setEnabled2FA] = useState(authUser?.twoFaEnabled);
  const [loadingSetup, setLoadingSetup] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [openBackupCodes, setOpenBackupCodes] = useState(false);
  const [openVerifyBackup, setOpenVerifyBackup] = useState(false);
  const [backupCodeInput, setBackupCodeInput] = useState("");
  useEffect(() => {
    setEnabled2FA(authUser?.twoFaEnabled);
  }, [authUser]);
  async function handleSetup2FA() {
    try {
      setLoadingSetup(true);

      const res = await fetch("/api/user/2fa/setup", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();

        throw new Error(errorData.error || "Failed to setup 2FA");
      }

      const result = await res.json();

      setQrUrl(result.data.qrUrl);
      setMode("enable");
      notify(
        "success",
        "2FA Setup Started",
        "Scan the QR code using your authenticator app.",
      );
    } catch (err: any) {
      notify("error", "Setup Failed", err.message || "Something went wrong.");
    } finally {
      setLoadingSetup(false);
    }
  }
  async function handleVerify2FA() {
    try {
      setLoadingVerify(true);

      const res = await fetch(`/api/user/2fa?otp=${otpCode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();

        throw new Error(errorData.error || "Invalid OTP");
      }

      const result = await res.json();

      const data = result.data;

      const enabled = data.enabled as boolean;

      if (authUser) {
        authSetUser({
          ...authUser,
          twoFaEnabled: enabled,
        });
      }

      setEnabled2FA(enabled);

      if (data.backupCodes?.length > 0) {
        setBackupCodes(data.backupCodes);
        setOpenBackupCodes(true);
      }

      setQrUrl(null);
      setMode(null);
      setOtpCode("");

      notify(
        "success",
        enabled ? "2FA enabled" : "2FA disabled",
        enabled
          ? "Your account is now protected with two-factor authentication."
          : "Two-factor authentication has been disabled.",
      );
    } catch (err: any) {
      notify(
        "error",
        "Verification failed",
        err.message || "Invalid verification code.",
      );
    } finally {
      setLoadingVerify(false);
    }
  }
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Security</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account security and authentication settings.
          </p>
        </div>

        {/* 2FA */}
        <div className="rounded-2xl border bg-background p-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex gap-4">
              <div>
                <h2 className="font-medium">Two-factor authentication</h2>

                <p className="text-sm text-muted-foreground mt-1 max-w-[520px]">
                  Protect your account with an additional verification step
                  during sign in.
                </p>

                {!enabled2FA ? (
                  <div
                    className="
                      mt-3 inline-flex items-center gap-2
                      rounded-full bg-amber-500/10
                      px-3 py-1 text-xs font-medium
                      text-amber-600
                    "
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Not enabled
                  </div>
                ) : (
                  <div
                    className="
                      mt-3 inline-flex items-center gap-2
                      rounded-full bg-green-500/10
                      px-3 py-1 text-xs font-medium
                      text-green-600
                    "
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Enabled
                  </div>
                )}
              </div>
            </div>
            {mode !== null ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Switch
                checked={enabled2FA}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleSetup2FA();
                    return;
                  }
                  setMode("disable");
                  setQrUrl(null);
                  setOtpCode("");
                  notify(
                    "info",
                    "Disable 2FA",
                    "Enter your authenticator code to disable two-factor authentication.",
                  );
                }}
                disabled={loadingSetup || loadingVerify}
              />
            )}
          </div>

          {/* METHOD */}
          <div className="mt-6 border-t pt-6">
            <h3 className="text-sm font-medium mb-4">Authentication method</h3>

            <div className="grid gap-3">
              {/* APP */}
              <div
                className="
                  rounded-xl border p-4
                "
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="
                        w-10 h-10 rounded-lg
                        bg-muted flex items-center justify-center
                      "
                    >
                      <Smartphone className="w-5 h-5" />
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-medium">Authenticator app</p>

                      <p className="text-xs text-muted-foreground">
                        Google Authenticator, Microsoft Authenticator
                      </p>
                    </div>
                  </div>
                </div>

                {/* QR SECTION */}
                {(mode === "enable" || mode === "disable") && (
                  <div className="mt-6 border-t pt-6">
                    <div className="flex flex-col items-center gap-4">
                      {qrUrl && (
                        <img
                          src={qrUrl}
                          alt="2FA QR Code"
                          className="w-52 h-52 rounded-xl border bg-white p-2"
                        />
                      )}

                      <div className="text-center">
                        <p className="text-sm font-medium">
                          {mode === "enable"
                            ? "Scan this QR code"
                            : "Disable two-factor authentication"}
                        </p>

                        <p className="text-xs text-muted-foreground mt-1">
                          {mode === "enable"
                            ? "Open your authenticator app and scan the QR code."
                            : "Enter the 6-digit code from your authenticator app to disable 2FA."}
                        </p>
                      </div>

                      <div className="w-full max-w-[240px] space-y-3">
                        <InputOTP
                          id="disabled"
                          maxLength={6}
                          value={otpCode}
                          onChange={(value) => setOtpCode(value)}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                        {mode === "disable" && (
                          <p className="text-xs text-center text-muted-foreground py-2 mt-2 leading-none">
                            Lost your device? You can use
                            <Button
                              variant="link"
                              className="text-primary hover:underline font-medium h-auto p-0 mx-1 text-xs"
                              onClick={() => {
                                setOpenVerifyBackup(true);
                              }}
                            >
                              backup codes
                            </Button>
                            to gain access.
                          </p>
                        )}
                        <div className="space-y-2">
                          <Button
                            className="w-full"
                            onClick={handleVerify2FA}
                            disabled={loadingVerify || otpCode.length !== 6}
                          >
                            {loadingVerify ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Verifying
                              </>
                            ) : mode === "enable" ? (
                              "Verify & Enable"
                            ) : (
                              "Verify & Disable"
                            )}
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            disabled={loadingVerify}
                            onClick={() => {
                              setMode(null);
                              setQrUrl(null);
                              setOtpCode("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* DEVICE */}
              <div
                className="
                  flex items-center justify-between
                  rounded-xl border p-4
                  hover:bg-muted/40
                  transition
                "
              >
                <div className="flex items-center gap-4">
                  <div
                    className="
                      w-10 h-10 rounded-lg
                      bg-muted flex items-center justify-center
                    "
                  >
                    <Laptop className="w-5 h-5" />
                  </div>

                  <div className="text-left">
                    <p className="text-sm font-medium">Trusted devices</p>

                    <p className="text-xs text-muted-foreground">
                      Skip verification on trusted devices
                    </p>
                  </div>
                </div>

                <Switch />
              </div>
            </div>
          </div>
        </div>
      </div>
      <BackupCodesDialog
        open={openBackupCodes}
        onOpenChange={setOpenBackupCodes}
        backupCodes={backupCodes}
      />
      <VerifyBackupCodeDialog
        open={openVerifyBackup}
        onOpenChange={setOpenVerifyBackup}
        loading={loadingVerify}
        onVerify={(code) => {
          console.log("Verifying with backup code:", code);
        }}
      />
    </div>
  );
}
