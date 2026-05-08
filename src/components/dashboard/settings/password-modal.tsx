"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/shadcn/dialog";

import { Button } from "@/src/components/shadcn/button";
import { Input } from "@/src/components/shadcn/input";

interface PasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  credentialStatus?: "PASSWORD_SET" | "NO_PASSWORD";

  onSubmit?: (data: {
    currentPassword?: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<void>;
}

export default function PasswordModal({
  open,
  onOpenChange,
  credentialStatus = "PASSWORD_SET",
  onSubmit,
}: PasswordModalProps) {
  const isCreateMode = credentialStatus === "NO_PASSWORD";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordChecks = {
    length: newPassword.length >= 8,
    upperLower: /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword),
    numberOrSymbol:
      /[0-9]/.test(newPassword) || /[^A-Za-z0-9]/.test(newPassword),
  };

  const passedChecks = Object.values(passwordChecks).filter(Boolean).length;

  const passwordStrength =
    passedChecks === 3 ? "Strong" : passedChecks === 2 ? "Medium" : "Weak";

  const passwordStrengthWidth =
    passedChecks === 3 ? "100%" : passedChecks === 2 ? "66%" : "33%";

  const passwordStrengthColor =
    passedChecks === 3
      ? "bg-green-500"
      : passedChecks === 2
        ? "bg-amber-500"
        : "bg-red-500";

  const reset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleClose = () => {
    if (loading) return;
    reset();
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    setError("");

    if (!newPassword.trim()) {
      setError("Password is required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!passwordChecks.length) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      await onSubmit?.({
        currentPassword: isCreateMode ? undefined : currentPassword,
        newPassword,
        confirmPassword,
      });

      handleClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">
        <div className="p-6 border-b">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {isCreateMode ? "Create password" : "Change password"}
            </DialogTitle>

            <DialogDescription className="pt-1 leading-relaxed">
              {isCreateMode
                ? "Add a password so you can sign in using email and password."
                : "Use a strong, unique password to keep your account secure."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* CURRENT PASSWORD */}
          {!isCreateMode && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Current password</label>

              <Input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          {/* NEW PASSWORD */}
          <div className="space-y-2">
            <label className="text-sm font-medium">New password</label>

            <Input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
            />

            {/* PASSWORD STRENGTH */}
            <div className="pt-2 space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Password strength
                  </span>

                  <span
                    className={`text-xs font-medium ${
                      passwordStrength === "Strong"
                        ? "text-green-600"
                        : passwordStrength === "Medium"
                          ? "text-amber-600"
                          : "text-red-600"
                    }`}
                  >
                    {passwordStrength}
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    style={{
                      width: passwordStrengthWidth,
                    }}
                    className={`h-full rounded-full transition-all ${passwordStrengthColor}`}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <PasswordCheckItem
                  passed={passwordChecks.length}
                  label="At least 8 characters"
                />

                <PasswordCheckItem
                  passed={passwordChecks.upperLower}
                  label="Uppercase & lowercase letters"
                />

                <PasswordCheckItem
                  passed={passwordChecks.numberOrSymbol}
                  label="Number or special character"
                />
              </div>
            </div>
          </div>

          {/* CONFIRM */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm password</label>

            <Input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />

            {confirmPassword && confirmPassword !== newPassword && (
              <p className="text-xs text-red-500">Passwords do not match.</p>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 border-t px-6 py-4 bg-muted/20">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading || !newPassword || !confirmPassword}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Saving
              </>
            ) : isCreateMode ? (
              "Create password"
            ) : (
              "Change password"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PasswordCheckItem({
  passed,
  label,
}: {
  passed: boolean;
  label: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 text-xs ${
        passed ? "text-green-600" : "text-muted-foreground"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          passed ? "bg-green-500" : "bg-muted-foreground/40"
        }`}
      />

      {label}
    </div>
  );
}
