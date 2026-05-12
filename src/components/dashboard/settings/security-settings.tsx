"use client";

import {
  AlertTriangle,
  Laptop,
  Loader2,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "../../shadcn/button";
import { Switch } from "../../shadcn/switch";

import { useAuthContext } from "@/src/context/authContext";
import { formatLastActive } from "@/src/utils/helpers";
import { useNotifyContext } from "../../notification/notificationProvider";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../../shadcn/input-otp";
import BackupCodesDialog from "./backup-dialog";
import TrustedDeviceDialog from "./trusted-device-dialog";
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
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [trustedDevice, setTrustedDevice] = useState<Session>();
  const [openTrustedDevice, setOpenTrustedDevice] = useState(false);
  const [loadingTrust, setLoadingTrust] = useState(false);
  useEffect(() => {
    fetchSessions();
  }, []);
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
  async function handleVerifyWithBackupCode(code: string) {
    try {
      setLoadingVerify(true);
      const res = await fetch(
        `/api/user/2fa/verify-backup?backupCode=${code}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      if (!res.ok) throw new Error("Invalid backup code");
      const result = await res.json();
      const data = result.data;
      const enabled = data.enabled as boolean;
      if (authUser) {
        authSetUser({
          ...authUser,
          twoFaEnabled: enabled,
        });
      }
      setEnabled2FA(false);
      setOpenVerifyBackup(false);
      setMode(null);
      notify("success", "Success", "2FA has been disabled using backup code.");
    } catch (err: any) {
      notify("error", "Failed", err.message);
    } finally {
      setLoadingVerify(false);
    }
  }
  async function fetchSessions() {
    try {
      setLoadingSessions(true);

      const res = await fetch("/api/user/sessions", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to load sessions");
      }

      const result = await res.json();
      const data = result.data || [];
      setSessions(data);

      const currentSession = data.find((s: any) => s.isCurrent);

      if (currentSession) {
        setTrustedDevice(currentSession);
      }
    } catch (err: any) {
      notify("error", "Failed", err.message);
    } finally {
      setLoadingSessions(false);
    }
  }
  async function revokeSession(sessionId: string) {
    try {
      setLoadingSessions(true);

      const res = await fetch(
        `/api/user/sessions/revoke?sessionId=${sessionId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      if (!res.ok) {
        throw new Error("Failed to revoke session");
      }
      setSessions((prevSessions) =>
        prevSessions.map((s) =>
          s.id === sessionId ? { ...s, isExpired: true } : s,
        ),
      );
    } catch (err: any) {
      notify("error", "Failed", err.message);
    } finally {
      setLoadingSessions(false);
    }
  }
  async function handleTrustDevice(otp: string) {
    try {
      setLoadingTrust(true);
      console.log(trustedDevice);
      const res = await fetch(
        `/api/user/sessions/trust?sessionId=${trustedDevice?.id}&otp=${otp}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      if (!res.ok) {
        throw new Error("Failed to revoke session");
      }
      if (trustedDevice) {
        setTrustedDevice({
          ...trustedDevice,
          isTrusted: !trustedDevice?.isTrusted,
        });
      }
      setOpenTrustedDevice(false);
    } catch (err: any) {
      notify("error", "Failed", err.message);
    } finally {
      setLoadingTrust(false);
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
        <div className="rounded-2xl border bg-muted p-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex gap-4">
              <div>
                <h2 className="font-medium">Two-factor authentication</h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-[520px]">
                  Protect your account with an additional verification step
                  during sign in.
                </p>
                {!enabled2FA ? (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Not enabled
                  </div>
                ) : (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600">
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
              <div className="rounded-xl border p-4">
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
              <div className="flex items-center justify-between rounded-xl border p-4 hover:bg-muted/40 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">Trusted devices</p>
                    <p className="text-xs text-muted-foreground">
                      Skip verification on trusted devices
                    </p>
                  </div>
                </div>
                <Switch
                  checked={trustedDevice?.isTrusted}
                  onCheckedChange={(checked) => {
                    setOpenTrustedDevice(true);
                  }}
                  disabled={!authUser?.twoFaEnabled}
                />
              </div>
              <div className="mt-6 border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium">Active sessions</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Manage devices currently signed in to your account.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {loadingSessions ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  ) : sessions.length === 0 ? (
                    <div className="rounded-xl border p-6 text-sm text-muted-foreground text-center">
                      No active sessions
                    </div>
                  ) : (
                    sessions
                      .sort((a, b) =>
                        a.isCurrent === b.isCurrent ? 0 : a.isCurrent ? -1 : 1,
                      ) // Đưa isCurrent lên đầu
                      .map((session) => {
                        const isCurrent = session.isCurrent;

                        return (
                          <div
                            key={session.id}
                            className={`rounded-xl border p-4 flex items-center justify-between ${
                              isCurrent ? "bg-muted/30 border-primary/20" : ""
                            }`}
                          >
                            <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                {session.deviceType === "Mobile" ? (
                                  <Smartphone className="w-5 h-5" />
                                ) : (
                                  <Laptop className="w-5 h-5" />
                                )}
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium">
                                    {session.browser} on {session.os}
                                  </p>
                                  {isCurrent && (
                                    <p className="text-xs text-blue-500 font-bold">
                                      • This device
                                    </p>
                                  )}
                                </div>

                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatLastActive(session.lastActive)}
                                </p>
                              </div>
                            </div>

                            {!isCurrent && (
                              <>
                                {session.isExpired ? (
                                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                                    Expired
                                  </span>
                                ) : (
                                  <Button
                                    size="xs"
                                    variant="outline"
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() => revokeSession(session.id)}
                                  >
                                    Logout
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })
                  )}
                </div>
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
        onVerify={handleVerifyWithBackupCode}
      />
      <TrustedDeviceDialog
        open={openTrustedDevice}
        onOpenChange={setOpenTrustedDevice}
        loading={loadingTrust}
        onVerify={handleTrustDevice}
      />
    </div>
  );
}
