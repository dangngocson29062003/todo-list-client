import { useState } from "react";
import { Dialog, DialogContent } from "../../shadcn/dialog";
import {
  Bell,
  Key,
  KeyRound,
  LockKeyhole,
  Palette,
  ShieldCheck,
  User,
} from "lucide-react";
import AccountSettings from "./account-settings";
import SecuritySettings from "./security-settings";
import ChangePasswordSettings from "./password-modal";
import PasswordSettings from "./password-modal";
import { useAuthContext } from "@/src/context/authContext";
import { Button } from "../../shadcn/button";

type SettingsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export default function SettingModal({
  open,
  onOpenChange,
}: SettingsModalProps) {
  const settingItems = [
    {
      key: "account",
      label: "Account",
      icon: User,
    },
    {
      key: "security",
      label: "Security",
      icon: ShieldCheck,
    },
    {
      key: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      key: "appearance",
      label: "Appearance",
      icon: Palette,
    },
  ];
  const [activeTab, setActiveTab] = useState("account");
  const { authUser } = useAuthContext();
  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountSettings />;
      case "security":
        return <SecuritySettings />;

      case "notifications":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-semibold">Notifications</h2>
          </div>
        );

      case "appearance":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-semibold">Appearance</h2>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          p-0 overflow-hidden
          max-w-7xl h-[820px]
          rounded-3xl border
                        bg-muted

        "
      >
        <div className="flex h-full">
          <div
            className="
              w-[240px]
              border-r

              flex flex-col
            "
          >
            {/* HEADER */}
            <div className="px-6 py-5 border-b">
              <h2 className="text-lg font-semibold">Settings</h2>

              <p className="text-xs text-muted-foreground mt-1">
                Manage your account preferences
              </p>
            </div>

            {/* MENU */}
            <div className="flex-1 p-3 space-y-1">
              {settingItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.key;

                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`
                      w-full flex items-center gap-3
                      px-3 py-2.5 rounded-xl
                      text-sm transition-all
                      ${
                        active
                          ? "bg-background shadow-sm border font-medium"
                          : "hover:bg-background/70 text-muted-foreground"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />

                    {item.label}
                  </button>
                );
              })}
            </div>
            {!authUser?.twoFaEnabled && (
              <div className="p-3 border-t">
                <div className="rounded-2xl border bg-background p-4 space-y-3">
                  <LockKeyhole className="w-4 h-4 text-gray-600" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">Protect your account</p>

                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Enable two-factor authentication to add an extra layer of
                      security to your account.
                    </p>
                  </div>

                  <Button
                    onClick={() => setActiveTab("security")}
                    className="w-full rounded-xl bg-blue-500 text-xs font-medium py-2 transition hover:bg-blue-300 hover:opacity-90"
                  >
                    Enable 2FA
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto">{renderContent()}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
