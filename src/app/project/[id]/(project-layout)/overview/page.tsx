import { Badge } from "@/src/components/shadcn/badge";
import { Progress } from "@/src/components/shadcn/progress";
import {
  BarChart3,
  Target,
  Users2,
  Code2,
  ExternalLink,
  Github,
  Figma,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Timer,
  Ban,
  TextAlignStart,
} from "lucide-react";
export default function ProjectOverview() {
  // Dữ liệu mẫu (Sau này bạn sẽ thay bằng API)
  const project = {
    description:
      "Thiết lập hệ thống quản lý Task tập trung, hỗ trợ theo dõi tiến độ thời gian thực và quản lý tài nguyên hiệu quả cho các dự án Web Development.",
    goals: [
      "Hoàn thiện hệ thống API CRUD trong tháng 4",
      "Tích hợp AI gợi ý phân bổ công việc",
      "Đạt 100 người dùng nội bộ trước quý 2",
    ],
    techStack: [
      "Next.js",
      "Spring Boot",
      "Prisma",
      "PostgreSQL",
      "Tailwind CSS",
    ],
    stage: "DEVELOPMENT",
    stats: {
      total: 42,
      completed: 28,
      overdue: 3,
      blocked: 2,
    },
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-6 text-zinc-300">
      <div className="flex-[2] space-y-6">
        <section className="space-y-2">
          <div className="flex gap-2 items-center text-xs font-bold uppercase tracking-wider">
            <TextAlignStart className="size-4" />
            Project Description
          </div>
          <div className="leading-relaxed">{project.description}</div>
        </section>

        {/* Section: Strategic Goals */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
            <Target size={14} /> <span>Key Objectives</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {project.goals.map((goal, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/20 border border-zinc-800/50 text-sm"
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

        {/* Section: Tech Stack */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
            <Code2 size={14} /> <span>Technology Stack</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-none px-3 py-1"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </section>
      </div>

      {/* CỘT PHẢI: CHỈ SỐ SỨC KHỎE (SIDEBAR) */}
      <div className="flex-1 min-w-[320px] space-y-6">
        {/* Card: Project Health */}
        <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
            <BarChart3 size={14} /> Project Health
          </h3>

          {/* Grid Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <p className="text-[10px] uppercase text-zinc-500 mb-1">Total</p>
              <p className="text-xl font-bold text-white">
                {project.stats.total}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-[10px] uppercase text-emerald-500/70 mb-1">
                Done
              </p>
              <p className="text-xl font-bold text-emerald-400">
                {project.stats.completed}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20">
              <p className="text-[10px] uppercase text-red-500/70 mb-1">
                Overdue
              </p>
              <p className="text-xl font-bold text-red-400">
                {project.stats.overdue}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <p className="text-[10px] uppercase text-amber-500/70 mb-1">
                Blocked
              </p>
              <p className="text-xl font-bold text-amber-400">
                {project.stats.blocked}
              </p>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-zinc-500 font-bold uppercase tracking-tighter">
                Overall Progress
              </span>
              <span className="text-emerald-400">67%</span>
            </div>
            <Progress value={67} className="h-1.5 bg-zinc-800" />
          </div>
        </div>

        {/* Card: Stage & Links */}
        <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500">Current Stage</span>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-2 py-0 font-mono text-[10px]">
              {project.stage}
            </Badge>
          </div>

          <hr className="border-zinc-800" />

          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">
              Resources
            </h4>
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

// Sub-component cho các link tài nguyên
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
