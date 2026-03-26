"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/shadcn/avatar";
import { Button } from "@/src/components/shadcn/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/shadcn/dialog";
import { Input } from "@/src/components/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/shadcn/select";
import { cn } from "@/src/lib/utils";
import { Role } from "@/src/types/enum";
import { ProjectMember } from "@/src/types/project-member";
import {
  Check,
  Copy,
  Loader2,
  Mail,
  Search,
  ShieldCheck,
  UserMinus,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Label } from "../shadcn/label";

interface InviteMemberFormProps {
  members: ProjectMember[];
  onAddMember: (m: ProjectMember) => void;
  onRemoveMember: (idOrEmail: string) => void;
  showInviteLink?: boolean;
  projectId?: string;
  isCreateStep?: boolean;
}

export function InviteMemberForm({
  members,
  onAddMember,
  onRemoveMember,
  showInviteLink = true,
  projectId,
  isCreateStep = false,
}: InviteMemberFormProps) {
  const [emailInput, setEmailInput] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>(Role.VIEWER);
  const [copied, setCopied] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(undefined);

  const inviteLink = "https://weaver.app/join/prj-789-xyz";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fetchUsers = useCallback(
    async (searchQuery: string, signal: AbortSignal) => {
      try {
        setIsSearching(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/user/search?query=${searchQuery}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal,
        });
        if (!res.ok) throw new Error();
        const result = await res.json();
        setSuggestions(result.data || []);
      } catch (error) {
        if ((error as Error).name !== "AbortError") console.error(error);
      } finally {
        setIsSearching(false);
      }
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    if (emailInput.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const timer = setTimeout(
      () => fetchUsers(emailInput, controller.signal),
      400,
    );
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [emailInput, fetchUsers]);

  const handleInvite = async () => {
    const emailToInvite = emailInput.trim();
    if (!emailToInvite || !emailToInvite.includes("@")) return;
    if (isCreateStep) {
      const isFromSystem = pendingUser && pendingUser.email === emailToInvite;
      const tempMember: any = {
        userId: isFromSystem ? pendingUser.id : null,
        email: emailToInvite,
        nickname:
          pendingUser?.nickname ||
          pendingUser?.fullName ||
          emailToInvite.split("@")[0],
        avatarUrl: pendingUser?.avatarUrl || "",
        role: selectedRole,
        status: "PENDING",
      };
      onAddMember(tempMember);
      setEmailInput("");
      setPendingUser(null);
      return;
    }
    if (projectId) {
      try {
        setIsInviting(true);
        const user = suggestions.find(
          (s) =>
            s.email.toLowerCase() === emailInput.trim().toLowerCase() ||
            s.nickname?.toLowerCase() === emailInput.trim().toLowerCase(),
        ) as User;
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/projects/${projectId}/members`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.id,
            role: selectedRole,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Invite failed");
        }
        const result = await res.json();
        const data = result.data;
        onAddMember(data);
        setEmailInput("");
        setPendingUser(null);
        setSuggestions([]);
      } catch (error: any) {
        alert(error.message);
      } finally {
        setIsInviting(false);
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pr-2 space-y-6 py-4 custom-scrollbar">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
            <Mail className="size-4" /> <span>Invite via Email</span>
          </label>
          <div className="flex gap-2 relative">
            <div className="relative flex-1">
              <Input
                value={emailInput}
                autoComplete="false"
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Email or username..."
                className="bg-muted/50 text-xs w-full pl-8"
              />
              <div className="absolute left-2.5 top-2.5 text-muted-foreground">
                {isSearching ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Search className="size-4" />
                )}
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg">
                  {suggestions.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setEmailInput(user.email);
                        setPendingUser(user);
                        setShowSuggestions(false);
                      }}
                      className="w-full flex items-center gap-3 p-2 hover:bg-muted text-left"
                    >
                      <Avatar className="size-6">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback className="text-[10px]">
                          {user.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold">
                          {user.nickname || user.fullName}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              onClick={handleInvite}
              disabled={isInviting || !emailInput.includes("@")}
              variant="ghost"
              className="text-xs font-bold"
            >
              {isInviting ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                "Invite"
              )}
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="size-4" /> <span>Assign Role</span>
          </label>
          <Select
            value={selectedRole}
            onValueChange={(v) => setSelectedRole(v as Role)}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value={Role.MANAGER}
                className="focus:bg-emerald-500/10"
              >
                <span className="text-xs font-semibold">Manager</span>

                <p className="text-[10px] text-muted-foreground">
                  Full control and settings.
                </p>
              </SelectItem>

              <SelectItem
                value={Role.CONTRIBUTOR}
                className="focus:bg-emerald-500/10"
              >
                <span className="text-xs font-semibold">Contributor</span>

                <p className="text-[10px] text-muted-foreground">
                  Can edit and update tasks.
                </p>
              </SelectItem>

              <SelectItem
                value={Role.VIEWER}
                className="focus:bg-emerald-500/10"
              >
                <span className="text-xs font-semibold">Viewer</span>

                <p className="text-[10px] text-muted-foreground">
                  View-only access.
                </p>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
          <span>Members</span>
          <div className="w-1 h-1 bg-muted-foreground rounded-full" />
          <span>{members.length}</span>
        </div>
        <div className="rounded-lg border bg-muted divide-y">
          {members.map((member, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 group transition-all duration-300 rounded-xl hover:bg-background hover:shadow-sm hover:translate-x-1 border border-transparent hover:border-border/50"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="size-9 ring-offset-background group-hover:ring-2 ring-emerald-500/30 transition-all duration-500">
                    <AvatarImage
                      src={member.avatarUrl ?? ""}
                      className="object-cover"
                    />

                    <AvatarFallback className="text-xs bg-muted-foreground/50 text-white font-bold">
                      {member.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground/90 group-hover:text-emerald-500 transition-colors duration-300">
                      {member.nickname ?? member.fullName}
                    </span>

                    <div className="w-1 h-1 bg-muted-foreground rounded-full" />

                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase text-muted-foreground/70",
                      )}
                    >
                      {member.role}
                    </span>
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {member.email}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 group">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase shrink-0">
                  {member.status}
                </Label>

                <div
                  className={cn(
                    "flex items-center justify-center overflow-hidden transition-all duration-300 ease-in-out",

                    "w-0 opacity-0 translate-x-2",

                    "group-hover:w-8 group-hover:opacity-100 group-hover:translate-x-0",
                  )}
                >
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() =>
                      onRemoveMember(isCreateStep ? member.email : member.id!)
                    }
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <UserMinus className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Link Section */}
      {showInviteLink && (
        <div className="space-y-2">
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>

            <div className="relative flex justify-center text-[9px] uppercase">
              <span className="bg-background px-2 text-muted-foreground font-black">
                Link access
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5 pl-3 rounded-lg bg-muted border border-fore-ground border-dashed border-border group transition-colors hover:border-black/50 dark:hover:border-white/50">
            <span className="text-[11px] text-muted-foreground truncate flex-1 font-medium">
              {inviteLink}
            </span>

            <Button
              onClick={handleCopy}
              size="sm"
              variant="ghost"
              className={cn(
                "h-7 px-3 text-[10px] font-bold uppercase transition-all duration-300",
                copied
                  ? "text-black dark:text-white"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {copied ? (
                <Check size={12} className="mr-1" />
              ) : (
                <Copy size={12} className="mr-1" />
              )}

              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Modal Wrapper
export function InviteMemberModal({ title, description, ...props }: any) {
  return (
    <DialogContent className="sm:max-w-[550px]">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">
          {title || "Project Collaboration"}
        </DialogTitle>
        <DialogDescription className="text-xs">
          {description || "Manage members and invites."}
        </DialogDescription>
      </DialogHeader>
      <InviteMemberForm {...props} />
    </DialogContent>
  );
}
