import React, { useState } from "react";
import {
  UserPlus2,
  Mail,
  ShieldCheck,
  Link2,
  Check,
  Copy,
  RotateCcw,
  MoreVertical,
  UserMinus,
} from "lucide-react";
// Giả sử bạn dùng component Avatar của Shadcn
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/shadcn/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/src/components/shadcn/dialog";
import { Input } from "@/src/components/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/shadcn/select";
import { Button } from "@/src/components/shadcn/button";
import { cn } from "@/src/lib/utils";

// Giả lập dữ liệu project, bạn hãy truyền từ props vào
export function InviteMemberModal({ members }: { members: any }) {
  const [copied, setCopied] = useState(false);
  const inviteLink = "https://weaver.app/join/prj-789-xyz";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-500/10 hover:text-emerald-500 transition-all"
        >
          <UserPlus2 size={14} />
          Invite
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[460px] border-border/50 shadow-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            Project Collaboration
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Manage current members and invite new collaborators to this project.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 py-4 custom-scrollbar">
          {/* 1. Email Invitation Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                <Mail className="size-4" />
                <p>Invite via Email</p>
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="name@gmail.com"
                  className="bg-muted/50 border-border/50 focus-visible:ring-emerald-500/20 text-xs! flex-1"
                />
                <Button
                  variant={"ghost"}
                  className="text-white text-xs font-bold"
                >
                  Invite
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="size-4" />
                <p>Assign Role</p>
              </label>
              <Select defaultValue="DEVELOPER">
                <SelectTrigger className="bg-muted/50 border-border/50 h-9 text-xs">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="MANAGER"
                    className="focus:bg-emerald-500/10 focus:text-emerald-500"
                  >
                    <span className="text-xs font-semibold">Manager</span>
                    <p className="text-[10px] text-muted-foreground">
                      Full control and settings.
                    </p>
                  </SelectItem>
                  <SelectItem
                    value="DEVELOPER"
                    className="focus:bg-emerald-500/10 focus:text-emerald-500"
                  >
                    <span className="text-xs font-semibold">Contributor</span>
                    <p className="text-[10px] text-muted-foreground">
                      Can edit and update tasks.
                    </p>
                  </SelectItem>
                  <SelectItem
                    value="VIEWER"
                    className="focus:bg-emerald-500/10 focus:text-emerald-500"
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

          {/* 2. Current Members Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground">
                Members
              </span>
              <div className="w-1 h-1 bg-muted-foreground rounded-full" />
              <span className="text-[10px] font-bold uppercase">
                {members.length || 0}
              </span>
            </div>

            <div className="rounded-lg border border-border/40 bg-muted/20 divide-y divide-border/40">
              {members?.map((member: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 group"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-7 border border-border/50">
                      <AvatarImage src={member.avatarUrl} />
                      <AvatarFallback className="text-xs bg-muted">
                        {member.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col leading-tight">
                      <span className="text-[11px] font-medium truncate">
                        {member.email}
                      </span>
                      <span className="text-[9px] text-muted-foreground uppercase font-bold">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  >
                    <UserMinus size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Magic Link Section */}
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

            <div className="flex items-center gap-2 p-1.5 pl-3 rounded-lg bg-muted/30 border border-dashed border-border group transition-colors hover:border-emerald-500/50">
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
                    ? "text-emerald-500"
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
            <p className="text-[9px] text-muted-foreground flex items-center gap-1">
              <RotateCcw size={10} /> Link expires in 7 days.
            </p>
          </div>
        </div>

        <DialogFooter className="sm:justify-start border-t border-border/20 pt-4 mt-auto">
          <Button
            variant="link"
            className="text-[10px] text-muted-foreground p-0 h-auto hover:text-emerald-500"
          >
            Audit Logs & Invite History
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
