import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogPortal,
  DialogOverlay,
} from "../../shadcn/dialog";
import { Button } from "../../shadcn/button";
import { Input } from "../../shadcn/input";
import { ShieldAlert, Loader2, FileKey } from "lucide-react";
import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../../shadcn/input-otp";

export default function VerifyBackupCodeDialog({
  open,
  onOpenChange,
  onVerify,
  loading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: (code: string) => void;
  loading: boolean;
}) {
  const [backupCodeInput, setBackupCodeInput] = useState("");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-xs" />
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          className="z-[10000] shadow-none"
        >
          <DialogHeader>
            <DialogTitle className="text-xl text-center">
              Use a backup code
            </DialogTitle>

            <DialogDescription className="leading-relaxed text-center">
              Enter one of your 8-character recovery codes to disable two-factor
              authentication.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4 flex justify-center items-center">
            <div className="space-y-4">
              <InputOTP
                id="disabled"
                maxLength={8}
                value={backupCodeInput}
                onChange={(value) => setBackupCodeInput(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="w-12 h-12" />
                  <InputOTPSlot index={1} className="w-12 h-12" />
                  <InputOTPSlot index={2} className="w-12 h-12" />
                  <InputOTPSlot index={3} className="w-12 h-12" />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={4} className="w-12 h-12" />
                  <InputOTPSlot index={5} className="w-12 h-12" />
                  <InputOTPSlot index={6} className="w-12 h-12" />
                  <InputOTPSlot index={7} className="w-12 h-12" />
                </InputOTPGroup>
              </InputOTP>
              <p className="text-[11px] text-center text-muted-foreground">
                Note: Each backup code can only be used once.
              </p>
            </div>
          </div>

          <DialogFooter className="mt-6 flex-col sm:flex-col gap-2">
            <Button
              className="w-full h-11 rounded-xl"
              disabled={loading || backupCodeInput.length < 6}
              onClick={() => onVerify(backupCodeInput)}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Verify Backup Code
            </Button>
            <Button
              variant="outline"
              className="w-full h-11 rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
