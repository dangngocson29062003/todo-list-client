"use client";

import { Alert, AlertTitle, AlertDescription } from "../shadcn/alert";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

type AlertType = "success" | "error" | "info" | "warning";

interface NotificationProps {
  title: string;
  description?: string;
  type?: AlertType;
  onClose?: () => void;
}

export default function Notification({
  title,
  description,
  type = "info",
  onClose,
}: NotificationProps) {

  const config = {
    success: {
      icon: CheckCircle2,
      iconColor: "text-green-600",
      alertColor: "border-green-500 bg-green-50 text-gray-800 ",
      variant: "default" as const,
    },
    error: {
      icon: AlertCircle,
      iconColor: "text-red-600",
      alertColor: "border-red-500 bg-red-50 text-gray-800",
      variant: "destructive" as const,
    },
    info: {
      icon: Info,
      iconColor: "text-blue-600",
      alertColor: "border-blue-500 bg-blue-50 text-gray-800",
      variant: "default" as const,
    },
    warning: {
      icon: AlertTriangle,
      iconColor: "text-yellow-600",
      alertColor: "border-yellow-500 bg-yellow-50 text-gray-800",
      variant: "default" as const,
    },
  };

  const { icon: Icon, iconColor, alertColor, variant } = config[type];

  return (
    <Alert
      variant={variant}
      className={`fixed top-4 right-4 z-[100] w-fit flex gap-3 items-start ${alertColor}`}>
      <Icon className={`h-5 w-5 ${iconColor}`} />

      <div className="flex-1">
        <AlertTitle>{title}</AlertTitle>
        {description && (
          <AlertDescription>{description}</AlertDescription>
        )}
      </div>

      {onClose && (
        <button onClick={onClose}>
          <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
        </button>
      )}
    </Alert>
  );
}