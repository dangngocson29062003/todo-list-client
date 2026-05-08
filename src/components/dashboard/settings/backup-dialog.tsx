"use client";

import { useState } from "react";
import { AlertTriangle, Check, Copy, Download, FileKey } from "lucide-react";

import { Button } from "../../shadcn/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "../../shadcn/dialog";

interface BackupCodesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  backupCodes: string[];
}

export default function BackupCodesDialog({
  open,
  onOpenChange,
  backupCodes,
}: BackupCodesDialogProps) {
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const handleDownload = () => {
    const content = backupCodes.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `backup-codes-${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsSaved(true);
  };
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(backupCodes.join("\n"));
      setCopied(true);
      setIsSaved(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-xs" />
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          showCloseButton={false}
          className="z-[10000] shadow-none"
        >
          <DialogHeader>
            <div className="flex justify-center mb-2">
              <FileKey className="w-12 h-12 shrink-0 mt-0.5 text-gray-500" />
            </div>
            <DialogTitle className="text-xl text-center">
              Save your backup codes
            </DialogTitle>

            <DialogDescription className="leading-relaxed text-center">
              Save these backup codes in a secure place. You can use them to
              access your account if you lose access to your authenticator app.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2">
            <div className="relative mt-2 rounded-2xl border bg-muted/20 p-4">
              <div className="absolute right-3 top-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs gap-1.5 hover:bg-background"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy all</span>
                    </>
                  )}
                </Button>
              </div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-4 ml-1">
                Recovery Codes
              </p>
              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code) => (
                  <div
                    key={code}
                    className="
          group relative
          rounded-xl border bg-background
          px-4 py-3
          font-mono text-sm tracking-widest
          text-center shadow-sm
          hover:border-blue-200 transition-colors
        "
                  >
                    {code}
                  </div>
                ))}
              </div>
            </div>
            <div
              className="
              mt-5 flex items-start gap-3
              rounded-2xl bg-amber-500/10
              p-4 text-amber-700
            "
            >
              <div>
                <p className="text-sm font-medium">Important</p>

                <p className="text-xs mt-1 leading-relaxed">
                  You can only see this once, so be sure to keep them to avoid
                  getting locked out of your account.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-5">
              <Button
                disabled={!isSaved}
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                I've stored the codes safely, close this.
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                onClick={handleDownload}
              >
                Download as text file
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
