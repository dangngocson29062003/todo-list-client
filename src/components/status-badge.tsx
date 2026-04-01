import { TaskStatus } from "../types/enum";

export function StatusIndicator({ status }: { status: TaskStatus }) {
  const config: any = {
    TODO: {
      component: (
        <div className="w-3 h-3 rounded-full border-[1.5px] border-slate-600/60" />
      ),
      color: "text-slate-500",
      label: "Todo",
    },
    IN_PROGRESS: {
      component: (
        <div className="relative w-3 h-3 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-blue-500/30 animate-[spin_4s_linear_infinite]" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
        </div>
      ),
      color: "text-blue-400",
      label: "In Progress",
    },
    REVIEW: {
      component: (
        <div className="flex gap-[2px]">
          <div className="w-[3px] h-3 bg-amber-500/80 rounded-full" />
          <div className="w-[3px] h-3 bg-amber-500/30 rounded-full" />
        </div>
      ),
      color: "text-amber-500",
      label: "Review",
    },
    DONE: {
      component: (
        <div className="w-2.5 h-2.5 bg-emerald-500 rotate-45 rounded-[1px]" />
      ),
      color: "text-emerald-500",
      label: "Done",
    },
  };

  const { component, color, label } = config[status] || config.TODO;

  return (
    <div className="flex items-center gap-3 group cursor-default">
      <div className="w-5 flex justify-center items-center flex-shrink-0 transition-all duration-300 group-hover:scale-125">
        {component}
      </div>
      <span
        className={`text-[12.5px] font-medium tracking-tight ${color} opacity-80 group-hover:opacity-100 transition-opacity`}
      >
        {label}
      </span>
    </div>
  );
}
