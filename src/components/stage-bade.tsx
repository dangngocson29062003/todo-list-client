import {
  AlertCircle,
  Beaker,
  CheckCircle2,
  Clock,
  FileText,
  Palette,
  Rocket,
  Settings,
  XCircle,
} from "lucide-react";
import { Badge } from "./shadcn/badge";
import { Stage } from "../types/enum";

export function StageBadge({ stage }: { stage: Stage }) {
  const config: any = {
    PLANNING: {
      color: "bg-slate-500/10 text-slate-500",
      icon: <FileText size={12} />,
      label: "Planning",
    },
    DESIGN: {
      color: "bg-pink-500/10 text-pink-500",
      icon: <Palette size={12} />,
      label: "Design",
    },
    DEVELOPMENT: {
      color: "bg-blue-500/10 text-blue-500",
      icon: <Clock size={12} />,
      label: "Development",
    },
    TESTING: {
      color: "bg-purple-500/10 text-purple-500",
      icon: <Beaker size={12} />,
      label: "Testing",
    },
    DEPLOYMENT: {
      color: "bg-cyan-500/10 text-cyan-500",
      icon: <Rocket size={12} />,
      label: "Deployment",
    },
    MAINTENANCE: {
      color: "bg-indigo-500/10 text-indigo-500",
      icon: <Settings size={12} />,
      label: "Maintenance",
    },
    COMPLETED: {
      color: "bg-emerald-500/10 text-emerald-500",
      icon: <CheckCircle2 size={12} />,
      label: "Completed",
    },
    ON_HOLD: {
      color: "bg-orange-500/10 text-orange-500",
      icon: <AlertCircle size={12} />,
      label: "On Hold",
    },
    CANCELLED: {
      color: "bg-red-500/10 text-red-500",
      icon: <XCircle size={12} />,
      label: "Cancelled",
    },
  };

  // Fallback về PLANNING nếu status không tồn tại
  const { color, icon, label } = config[stage] || config.PLANNING;

  return (
    <Badge
      className={`text-[10px] gap-2 shadow items-center rounded-full font-bold uppercase whitespace-nowrap ${color}`}
    >
      {icon} {label}
    </Badge>
  );
}
