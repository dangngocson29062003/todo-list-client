interface OtpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  loading?: boolean;

  onVerify?: (otp: string) => Promise<void>;
}
export default function OtpModal({
  open,
  onOpenChange,
  loading = false,
  onVerify,
}: OtpModalProps) {}
