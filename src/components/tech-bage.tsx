import { Badge } from "@/src/components/shadcn/badge";
import { cn } from "@/src/lib/utils";
import * as SI from "@icons-pack/react-simple-icons";
import { ReactElement } from "react";
import { TechStack } from "../types/enum";
import Image from "next/image";

export interface TechConfig {
  icon?: ReactElement;
  label: string;
  color: string; // Tailwind classes
}

export const TECH_MAP: Record<string, TechConfig> = {
  // --- Frontend ---
  [TechStack.NEXTJS]: {
    icon: <SI.SiNextdotjs size={12} />,
    label: "Next.js",
    color: "bg-black text-white border-slate-700",
  },
  [TechStack.REACT]: {
    icon: <SI.SiReact size={12} />,
    label: "React",
    color: "bg-[#61DAFB]/10 text-[#00A3CC] border-[#61DAFB]/20",
  },
  [TechStack.TYPESCRIPT]: {
    icon: <SI.SiTypescript size={12} />,
    label: "TypeScript",
    color: "bg-[#3178C6]/10 text-[#3178C6] border-[#3178C6]/20",
  },
  [TechStack.TAILWIND_CSS]: {
    icon: <SI.SiTailwindcss size={12} />,
    label: "Tailwind",
    color: "bg-[#38BDF8]/10 text-[#0EA5E9] border-[#38BDF8]/20",
  },
  [TechStack.SHADCN_UI]: {
    icon: <SI.SiShadcnui size={12} />,
    label: "Shadcn UI",
    color: "bg-slate-900 text-slate-100 border-slate-800",
  },
  [TechStack.REDUX]: {
    icon: <SI.SiRedux size={12} />,
    label: "Redux",
    color: "bg-[#764ABC]/10 text-[#764ABC] border-[#764ABC]/20",
  },
  [TechStack.ZUSTAND]: {
    icon: <SI.SiGhost size={12} />, // Zustand chưa có icon chính thức trên SI, dùng Ghost làm đại diện
    label: "Zustand",
    color: "bg-[#443E38]/10 text-[#443E38] border-[#443E38]/20",
  },

  // --- Backend ---
  [TechStack.SPRING_BOOT]: {
    icon: <SI.SiSpringboot size={12} />,
    label: "Spring Boot",
    color: "bg-[#6DB33F]/10 text-[#6DB33F] border-[#6DB33F]/20",
  },
  [TechStack.JAVA]: {
    icon: <SI.SiOpenjdk size={12} />,
    label: "Java",
    color: "bg-[#ED8B00]/10 text-[#ED8B00] border-[#ED8B00]/20",
  },
  [TechStack.NODEJS]: {
    icon: <SI.SiNodedotjs size={12} />,
    label: "Node.js",
    color: "bg-[#339933]/10 text-[#339933] border-[#339933]/20",
  },
  [TechStack.NESTJS]: {
    icon: <SI.SiNestjs size={12} />,
    label: "NestJS",
    color: "bg-[#E0234E]/10 text-[#E0234E] border-[#E0234E]/20",
  },
  [TechStack.EXPRESS]: {
    icon: <SI.SiExpress size={12} />,
    label: "Express",
    color: "bg-slate-500/10 text-slate-600 border-slate-200",
  },

  // --- Database ---
  [TechStack.POSTGRESQL]: {
    icon: <SI.SiPostgresql size={12} />,
    label: "PostgreSQL",
    color: "bg-[#4169E1]/10 text-[#4169E1] border-[#4169E1]/20",
  },
  [TechStack.MONGODB]: {
    icon: <SI.SiMongodb size={12} />,
    label: "MongoDB",
    color: "bg-[#47A248]/10 text-[#47A248] border-[#47A248]/20",
  },
  [TechStack.PRISMA]: {
    icon: <SI.SiPrisma size={12} />,
    label: "Prisma",
    color: "bg-[#2D3748]/10 text-[#2D3748] border-[#2D3748]/20",
  },
  [TechStack.REDIS]: {
    icon: <SI.SiRedis size={12} />,
    label: "Redis",
    color: "bg-[#DC382D]/10 text-[#DC382D] border-[#DC382D]/20",
  },
  [TechStack.MYSQL]: {
    icon: <SI.SiMysql size={12} />,
    label: "MySQL",
    color: "bg-[#4479A1]/10 text-[#4479A1] border-[#4479A1]/20",
  },

  // --- DevOps ---
  [TechStack.DOCKER]: {
    icon: <SI.SiDocker size={12} />,
    label: "Docker",
    color: "bg-[#2496ED]/10 text-[#2496ED] border-[#2496ED]/20",
  },
  [TechStack.AWS]: {
    label: "AWS",
    color: "bg-[#FF9900]/10 text-[#FF9900] border-[#FF9900]/20",
  },
  [TechStack.VERCEL]: {
    icon: <SI.SiVercel size={12} />,
    label: "Vercel",
    color: "bg-black text-white",
  },
  [TechStack.GIT]: {
    icon: <SI.SiGit size={12} />,
    label: "Git",
    color: "bg-[#F05032]/10 text-[#F05032] border-[#F05032]/20",
  },
};

interface TechTagProps {
  tech: TechStack;
  className?: string;
}
export function TechBadge({ tech, className }: TechTagProps) {
  const config = TECH_MAP[tech];
  if (!config) {
    return (
      <Badge variant="secondary" className="text-[10px]">
        {tech}
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-2 text-[10px] font-bold uppercase transition-all duration-300",
        "backdrop-blur-sm border",
        config.color,
        className,
      )}
    >
      {config.icon && <span className="shrink-0">{config.icon}</span>}

      <span>{config.label}</span>
    </Badge>
  );
}
