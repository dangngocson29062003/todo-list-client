"use client";
import { ProjectProgressArea } from "@/src/components/project/chart/area-chart";
import { MemberChart } from "@/src/components/project/chart/bar-chart";
import { TasksChart } from "@/src/components/project/chart/pie-chart";
import { InviteMemberModal } from "@/src/components/project/invite-modal";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/shadcn/avatar";
import { Badge } from "@/src/components/shadcn/badge";
import { Progress } from "@/src/components/shadcn/progress";
import { TechBadge } from "@/src/components/tech-bage";
import { useProject } from "@/src/context/projectContext";
import { calculateProgress } from "@/src/helpers/helpter";
import { cn } from "@/src/lib/utils";
import { format } from "date-fns";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarIcon,
  CheckCircle2,
  Code2,
  ExternalLink,
  Figma,
  Github,
  Target,
  TextAlignStart,
} from "lucide-react";
export default function ProjectOverview() {
  const { project, loading } = useProject();

  if (loading) return <div>Loading project details...</div>;

  const progressValue = calculateProgress(project.startDate, project.endDate);
  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-6">
      <div className="flex-[2] space-y-6">
        <section className="space-y-2">
          <div className="flex gap-2 items-center text-xs font-bold uppercase tracking-wider">
            <TextAlignStart className="size-4" />
            Project Description
          </div>
          <div className="rounded-md text-sm p-4 bg-muted-foreground/10 shadow  leading-relaxed">
            {project.description}
          </div>
        </section>
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <Target size={14} /> <span>Key Objectives</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {project.goals?.map((goal, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl shadow bg-muted-foreground/10 text-sm"
              >
                <CheckCircle2
                  size={16}
                  className="text-emerald-500 mt-0.5 shrink-0"
                />
                <span>{goal}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <Code2 size={14} /> <span>Technology Stack</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.techStack?.map((tech, index) => (
              <TechBadge tech={tech} key={index} />
            ))}
          </div>
        </section>
        <section className="space-y-4">
          <div className="flex gap-2 items-center text-xs font-bold uppercase tracking-wider">
            <BarChart3 size={14} /> Analytics Overview
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 p-5 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Growth & Progress
                </h4>
              </div>
              <ProjectProgressArea />
            </div>
            <div className="p-5 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center">
              <div className="mb-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Tasks Analytics
                </h4>
              </div>
              <TasksChart stats={project.stats} />
            </div>
          </div>
          <div className="p-5 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Team Capacity
              </h4>
            </div>
            <MemberChart members={project.members} />
          </div>
        </section>
      </div>
      <div className="flex-1 min-w-[320px] space-y-6">
        <div className="p-6 rounded-2xl bg-muted shadow space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-bold uppercase text-zinc-500">
              Timeline
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg ">
                  <CalendarIcon size={14} />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">
                    Start Date
                  </p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-200">
                    {format(new Date(project.startDate), "LLLL dd,yyyy")}
                  </p>
                </div>
              </div>
              <ArrowRight size={14} />
              <div className="text-right">
                <p className="text-[10px] text-zinc-500 uppercase font-bold">
                  End Date
                </p>
                <p className="font-medium text-zinc-900 dark:text-zinc-200">
                  {format(project.endDate, "LLLL dd, yyyy")}
                </p>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <div className="flex justify-between text-[11px] font-bold uppercase">
                <span className="text-emerald-500">Completion</span>
                <span className="text-zinc-500">{progressValue}%</span>
              </div>
              <Progress
                value={progressValue}
                className="h-1.5 bg-zinc-200 dark:bg-zinc-800"
              />
            </div>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-muted shadow space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-[10px] font-bold uppercase text-muted-foreground">
                  Members
                </h4>
                <Badge
                  variant="secondary"
                  className="flex justify-center items-center h-5 px-1.5 text-[10px] font-bold bg-emerald-500 text-emerald-100 dark:bg-emerald-100 dark:text-emerald-500"
                >
                  {project.members.length}
                </Badge>
              </div>

              <InviteMemberModal members={project.members} />
            </div>

            <div className="space-y-1">
              {project.members.map((item, index) => {
                // Logic định nghĩa màu sắc theo Role
                const isOwner =
                  item.role.toString().toUpperCase() === "MANAGER";

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 group transition-all duration-300 rounded-xl hover:bg-background hover:shadow-sm hover:translate-x-1 border border-transparent hover:border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="size-9 ring-offset-background group-hover:ring-2 ring-emerald-500/30 transition-all duration-500">
                          <AvatarImage
                            src={item.avatarUrl ?? ""}
                            className="object-cover"
                          />
                          <AvatarFallback className="text-xs bg-muted-foreground/50 text-white font-bold">
                            {item.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 right-0 size-2.5 bg-emerald-500 border-2 border-muted rounded-full" />
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground/90 group-hover:text-emerald-500 transition-colors duration-300">
                            {item.nickname ?? item.fullName}
                          </span>
                          <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                          <span
                            className={cn(
                              "text-[10px] font-bold uppercase",
                              isOwner
                                ? "text-amber-500/80"
                                : "text-muted-foreground/70",
                            )}
                          >
                            {item.role}
                          </span>
                        </div>

                        <span className="text-xs text-muted-foreground">
                          {item.email}
                        </span>
                      </div>
                    </div>

                    {/* Hiển thị Badge hoặc Action tùy ý */}
                    <div className="flex items-center gap-2">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <button className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors">
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-muted shadow space-y-4">
          <div className="flex justify-between items-center text-sm">
            <h4 className="text-[10px] font-bold uppercase text-zinc-500">
              Resources
            </h4>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              <ResourceLink icon={<Github size={14} />} label="Repository" />
              <ResourceLink icon={<Figma size={14} />} label="Figma Design" />
              <ResourceLink
                icon={<BookOpen size={14} />}
                label="Documentation"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function ResourceLink({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href="#"
      className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800 transition-colors text-sm text-zinc-400 hover:text-white group"
    >
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      <ExternalLink
        size={12}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </a>
  );
}
