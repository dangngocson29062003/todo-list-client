"use client";

import { useAuthContext } from "@/src/context/authContext";
import { Camera, Edit2 } from "lucide-react";
import { useState } from "react";
import { InlineEditField } from "../../inline-edit-input";
import { Avatar, AvatarFallback, AvatarImage } from "../../shadcn/avatar";
import { Button } from "../../shadcn/button";
import PasswordModal from "./password-modal";
import { useNotifyContext } from "../../notification/notificationProvider";

export default function AccountSettings() {
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const { authToken, authUser, authSetUser } = useAuthContext();
  const notify = useNotifyContext();
  async function handlePasswordSubmit({
    currentPassword,
    newPassword,
  }: {
    currentPassword?: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    try {
      const response = await fetch("/api/user/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: "Failed to update password",
        }));

        throw new Error(errorData.error || "Failed to update password");
      }

      notify(
        "success",
        authUser?.credentialStatus === "NO_PASSWORD"
          ? "Password created"
          : "Password updated",
        authUser?.credentialStatus === "NO_PASSWORD"
          ? "You can now sign in using your password."
          : "Your password has been updated successfully.",
      );
      if (authUser?.credentialStatus === "NO_PASSWORD") {
        authSetUser({
          ...authUser,
          credentialStatus: "PASSWORD_SET",
        });
      }
      setOpenPasswordModal(false);
    } catch (err) {
      notify(
        "error",
        "Password update failed",
        err instanceof Error ? err.message : "Something went wrong.",
      );

      throw err;
    }
  }
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Account</h1>

          <p className="text-sm text-muted-foreground mt-1">
            Manage your profile information and account settings.
          </p>
        </div>

        <div className="flex items-center justify-between border-b pb-8">
          <div>
            <h2 className="font-medium">Profile photo</h2>

            <p className="text-sm text-muted-foreground mt-1">
              This will be displayed on your profile.
            </p>
          </div>

          <div className="relative group">
            <Avatar className="h-16 w-16 hover:scale-105 transition">
              <AvatarImage src={authUser?.avatarUrl} />
              <AvatarFallback>
                {authUser?.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <button
              className="
                absolute inset-0 rounded-full
                bg-black/50 opacity-0 group-hover:opacity-100
                flex items-center justify-center
                transition
              "
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        {/* FORM */}
        <div className="space-y-6 py-8">
          {/* FULL NAME */}
          <div className="grid grid-cols-[180px_1fr] gap-6 items-center">
            <div>
              <h3 className="text-sm font-medium">Full name</h3>
              <p className="text-xs text-muted-foreground mt-1">
                How you'll appear to your teammates.
              </p>
            </div>

            <div className="space-y-2">
              <InlineEditField
                value={authUser?.fullName as string}
                emptyText="Mystery Member"
              />

              {!authUser?.fullName && (
                <p className="text-xs text-amber-500">
                  Add your name so teammates can recognize you more easily.
                </p>
              )}
            </div>
          </div>

          {/* USERNAME / NICKNAME */}
          <div className="grid grid-cols-[180px_1fr] gap-6 items-center">
            <div>
              <h3 className="text-sm font-medium">Nickname</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Used by teammates to invite you to projects
              </p>
            </div>

            <div className="space-y-2">
              <InlineEditField
                value={authUser?.nickname as string}
                emptyText="No nickname"
              />

              <p className="text-xs text-muted-foreground">
                weaver.app/u/{authUser?.nickname || "username"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-[180px_1fr] gap-6 items-center">
            <div>
              <h3 className="text-sm font-medium">Email</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Used for project invites and notifications.
              </p>
            </div>
            <InlineEditField value={authUser?.email || "No email provided"} />
          </div>
          <div className="grid grid-cols-[180px_1fr] gap-6 items-center">
            <div>
              <h3 className="text-sm font-medium">Password</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Keep your account secure with a strong password
              </p>
            </div>
            <div className="group flex items-center gap-2 min-w-0">
              <p className="text-sm italic text-muted-foreground">
                {authUser?.credentialStatus === "NO_PASSWORD"
                  ? "Your account doesn’t have a password yet"
                  : "********"}
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpenPasswordModal(true)}
                className="shrink-0 w-4 h-4 p-0 text-gray-400 lg:opacity-0 transition-opacity lg:group-hover:opacity-100"
              >
                <Edit2 className="size-4" />
              </Button>
              <PasswordModal
                open={openPasswordModal}
                onOpenChange={setOpenPasswordModal}
                credentialStatus={authUser?.credentialStatus}
                onSubmit={handlePasswordSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
