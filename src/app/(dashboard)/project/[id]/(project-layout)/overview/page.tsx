"use client";
import { InlineEditDate } from "@/src/components/inline-edit-date";
import { KeyObjectivesSection } from "@/src/components/inline-edit-goals";
import { InlineEditField } from "@/src/components/inline-edit-input";
import { InlineEditTechStack } from "@/src/components/inline-edit-teckstack";
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
import { Button } from "@/src/components/shadcn/button";
import { Dialog, DialogTrigger } from "@/src/components/shadcn/dialog";
import { Progress } from "@/src/components/shadcn/progress";
import { TechBadge } from "@/src/components/tech-bage";
import { useProjects } from "@/src/context/homeContext";
import { useProject } from "@/src/context/projectContext";
import { calculateProgress } from "@/src/helpers/helpter";
import { updateProject } from "@/src/lib/api-project";
import { cn } from "@/src/lib/utils";
import { ProjectMember } from "@/src/types/project-member";
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
  UserPlus2,
} from "lucide-react";
import { useEffect, useState } from "react";
export default function ProjectOverview() {
  const { project, setProject, loading, refreshProject } = useProject();

  const { addRecent, toggleFavorite } = useProjects();
  useEffect(() => {
    if (!project) return;

    addRecent({
      ...project,
      lastAccess: new Date(),
    });
  }, [project]);
  const handleAddMember = (newMember: ProjectMember) => {
    setProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        members: [...prev.members, newMember],
      };
    });
  };
  const handleRemoveMember = async (memberId: string) => {
    setProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        members: prev.members.filter((m) => m.id !== memberId),
      };
    });
  };
  if (loading) return <div>Loading project details...</div>;

  const progressValue = calculateProgress(project.startDate, project.endDate);
  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      <div className="flex-[2] space-y-4">
        <InlineEditField
          value={project.description as string}
          icon={<TextAlignStart className="size-4" />}
          label="Description"
          placeholder="Add a description to help others understand what this is about..."
          fieldType="textarea"
          renderDisplay={(value) => (
            <div className="flex items-center gap-4 rounded-xl bg-muted px-4 py-3 shadow-sm hover:shadow-md transition-shadow px-6 py-3">
              <span className="text-sm italic text-muted-foreground">
                {value || "No description provided for this project."}
              </span>
            </div>
          )}
          onSave={async (value) => {
            await updateProject(project.id, {
              description: value,
            });
            await refreshProject();
          }}
        />
        <KeyObjectivesSection
          goals={project.goals as string[]}
          onSave={async (value) => {
            await updateProject(project.id, {
              goals: value,
            });
            await refreshProject();
          }}
        />
        <InlineEditTechStack
          value={project.techStack}
          onSave={async (value) => {
            await updateProject(project.id, {
              techStack: value,
            });
            await refreshProject();
          }}
        />
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BarChart3 className="size-4" />
            <span>Analytics Overview</span>
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
        <div className="rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow p-6">
          <h3 className="text-[10px] font-bold uppercase text-zinc-500 mb-4">
            Timeline
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg ">
                  <CalendarIcon className="size-4" />
                </div>
                <div>
                  <InlineEditDate
                    label="Start date"
                    value={project.startDate}
                  />
                </div>
              </div>
              <ArrowRight className="size-4" />
              <div className="text-right">
                <InlineEditDate label="End date" value={project.endDate} />
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
        <div className="rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow p-6">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
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
                <InviteMemberModal
                  members={project.members}
                  onAddMember={handleAddMember}
                  onRemoveMember={handleRemoveMember}
                  projectId={project.id}
                />
              </Dialog>
            </div>

            <div className="space-y-1">
              {project.members.map((item, index) => {
                const isOwner =
                  item.role?.toString().toUpperCase() === "MANAGER";
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
                    <div className="flex items-center gap-2">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <button className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors">
                          <ExternalLink className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow p-6">
          <div className="flex justify-between items-center text-sm">
            <h4 className="text-[10px] font-bold uppercase text-zinc-500">
              Resources
            </h4>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              <ResourceLink
                icon={<Github className="size-4" />}
                label="Repository"
              />
              <ResourceLink
                icon={<Figma className="size-4" />}
                label="Figma Design"
              />
              <ResourceLink
                icon={<BookOpen className="size-4" />}
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
