import { Project } from "@/src/types/project";
import { format, formatDistanceToNow } from "date-fns";
import { ArrowRight, Clock3 } from "lucide-react";
import Link from "next/link";

export default function DeletedProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/project/${project.id}/overview`}
      className="group block w-56 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:shadow-lg"
    >
      <div className="flex min-h-62 flex-col">
        <div className="flex flex-1 flex-col items-start gap-2">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-md border border-border bg-background text-xl font-bold shadow-sm transition-colors group-hover:bg-muted-foreground/10">
            {project.name.charAt(0).toUpperCase()}
          </div>

          <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary">
            {project.name}
          </h3>

          <p className="line-clamp-4 text-xs leading-5 text-muted-foreground">
            {project.description || "No description provided for this project."}
          </p>
        </div>

        <div className="mt-4 flex min-h-[30px] items-center justify-between gap-2 text-xs">
          <div className="flex min-w-0 items-start gap-1 text-muted-foreground">
            <Clock3 className="mt-0.5 size-3.5 shrink-0" />
            <div className="flex min-w-0 flex-col leading-tight">
              {/* <span className="truncate">
                {formatDistanceToNow(new Date(project.lastAccess), {
                  addSuffix: true,
                })}
              </span> */}
              <span className="text-[10px] text-muted-foreground/70 truncate">
                {format(new Date(project.deletedAt), "HH:mm dd/MM/yyyy")}
              </span>
            </div>
          </div>

          <div className="shrink-0 flex translate-x-1 items-center text-primary opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
            <ArrowRight className="ml-1 size-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
