import { ProjectProgressArea } from "@/src/components/project/chart/area-chart";
import { MemberChart } from "@/src/components/project/chart/bar-chart";
import { TasksChart } from "@/src/components/project/chart/pie-chart";
import { Badge } from "@/src/components/shadcn/badge";
import { Progress } from "@/src/components/shadcn/progress";
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
  const project = {
    description:
      "Establish a centralized Task Management system supporting real-time progress tracking and efficient resource management for Web Development projects.",
    goals: [
      "Complete the full suite of CRUD APIs by April",
      "Integrate AI-driven task allocation suggestions",
      "Reach 100 internal active users by the end of Q2",
    ],
    techStack: ["Spring Boot", "Prisma", "PostgreSQL"],
    startDate: "2026-01-10",
    endDate: "2026-06-15",
    creator: {
      name: "Dang Ngoc Son",
      avatar: "https://github.com/shadcn.png",
      email: "dangngocson@example.com",
    },
    members: [
      {
        email: "dangngocson29062003@gmail.com",
        name: "Dang Ngoc Son",
        avatar: "",
      },
      {
        email: "phungvantiendat@gmail.com",
        name: "Phung Van Tien Dat",
        avatar: "",
      },
      {
        email: "ngueynminhkhang@gmail.com",
        name: "Nguyen Minh Khang",
        avatar: "",
      },
    ],
    stage: "DEVELOPMENT",
    stats: {
      total: 42,
      todo: 24,
      in_progress: 7,
      done: 11,
      block: 0,
    },
  };
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
            {project.goals.map((goal, i) => (
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
            {project.techStack.map((tech) => (
              <Badge key={tech}>{tech}</Badge>
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
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
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
                    {format(project.startDate, "LLLL dd,yyyy")}
                  </p>
                </div>
              </div>
              <ArrowRight size={14} />
              <div className="text-right">
                <p className="text-[10px] text-zinc-500 uppercase font-bold">
                  End Date
                </p>
                <p className="font-medium text-zinc-900 dark:text-zinc-200">
                  {format(project.endDate, "LLLL dd,yyyy")}
                </p>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <div className="flex justify-between text-[11px] font-bold uppercase">
                <span className="text-emerald-500">Completion</span>
                <span className="text-zinc-500">67%</span>
              </div>
              <Progress value={67} className="h-1.5 bg-zinc-800" />
            </div>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-muted shadow space-y-4">
          <div className="flex justify-between items-center text-sm">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
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
