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
    icon: <SI.SiNextdotjs className="size-4 fill-[#000000] dark:fill-white" />,
    label: "Next.js",
    color:
      "bg-[#000000]/10 dark:bg-white/10 text-[#000000] dark:text-white border-[#000000] dark:border-white/10",
  },
  [TechStack.REACT]: {
    icon: <SI.SiReact className="size-4 fill-[#61DAFB]" />,
    label: "React",
    color: "bg-[#61DAFB]/10 text-[#00A3CC] border-[#61DAFB]/20",
  },
  [TechStack.TYPESCRIPT]: {
    icon: <SI.SiTypescript className="size-4 fill-[#3178C6]" />,
    label: "TypeScript",
    color: "bg-[#3178C6]/10 text-[#3178C6] border-[#3178C6]/20",
  },
  [TechStack.TAILWIND_CSS]: {
    icon: <SI.SiTailwindcss className="size-4 fill-[#38BDF8]" />,
    label: "Tailwind",
    color: "bg-[#38BDF8]/10 text-[#0EA5E9] border-[#38BDF8]/20",
  },
  [TechStack.SHADCN_UI]: {
    icon: <SI.SiShadcnui className="size-4 fill-[#000000] dark:fill-white" />,
    label: "Shadcn UI",
    color:
      "bg-[#000000]/10 dark:bg-white/10 text-[#000000] dark:text-white border-[#000000] dark:border-white/10",
  },
  [TechStack.REDUX]: {
    icon: <SI.SiRedux className="size-4 fill-[#764ABC]" />,
    label: "Redux",
    color: "bg-[#764ABC]/10 text-[#764ABC] border-[#764ABC]/20",
  },
  [TechStack.ZUSTAND]: {
    icon: <SI.SiGhost className="size-4 fill-[#443E38]" />, // Zustand chưa có icon chính thức trên SI, dùng Ghost làm đại diện
    label: "Zustand",
    color: "bg-[#443E38]/10 text-[#443E38] border-[#443E38]/20",
  },

  // --- Backend ---
  [TechStack.SPRING_BOOT]: {
    icon: <SI.SiSpringboot className="size-4 fill-[#6DB33F]" />,
    label: "Spring Boot",
    color: "bg-[#6DB33F]/10 text-[#6DB33F] border-[#6DB33F]/20",
  },
  [TechStack.JAVA]: {
    icon: <SI.SiOpenjdk className="size-4 fill-[#ED8B00]" />,
    label: "Java",
    color: "bg-[#ED8B00]/10 text-[#ED8B00] border-[#ED8B00]/20",
  },
  [TechStack.NODEJS]: {
    icon: <SI.SiNodedotjs className="size-4 fill-[#339933]" />,
    label: "Node.js",
    color: "bg-[#339933]/10 text-[#339933] border-[#339933]/20",
  },
  [TechStack.NESTJS]: {
    icon: <SI.SiNestjs className="size-4 fill-[#E0234E]" />,
    label: "NestJS",
    color: "bg-[#E0234E]/10 text-[#E0234E] border-[#E0234E]/20",
  },
  [TechStack.EXPRESS]: {
    icon: <SI.SiExpress className="size-4 fill-[#000000] dark:fill-white" />,
    label: "Express",
    color:
      "bg-[#000000]/10 dark:bg-white/10 text-[#000000] dark:text-white border-[#000000] dark:border-white/10",
  },

  // --- Database ---
  [TechStack.POSTGRESQL]: {
    icon: <SI.SiPostgresql className="size-4 fill-[#4169E1]" />,
    label: "PostgreSQL",
    color: "bg-[#4169E1]/10 text-[#4169E1] border-[#4169E1]/20",
  },
  [TechStack.MONGODB]: {
    icon: <SI.SiMongodb className="size-4 fill-[#47A248]" />,
    label: "MongoDB",
    color: "bg-[#47A248]/10 text-[#47A248] border-[#47A248]/20",
  },
  [TechStack.PRISMA]: {
    icon: <SI.SiPrisma className="size-4 fill-[#2D3748]" />,
    label: "Prisma",
    color: "bg-[#2D3748]/10 text-[#2D3748] border-[#2D3748]/20",
  },
  [TechStack.REDIS]: {
    icon: <SI.SiRedis className="size-4 fill-[#DC382D]" />,
    label: "Redis",
    color: "bg-[#DC382D]/10 text-[#DC382D] border-[#DC382D]/20",
  },
  [TechStack.MYSQL]: {
    icon: <SI.SiMysql className="size-4 fill-[#4479A1]" />,
    label: "MySQL",
    color: "bg-[#4479A1]/10 text-[#4479A1] border-[#4479A1]/20",
  },

  // --- DevOps ---
  [TechStack.DOCKER]: {
    icon: <SI.SiDocker className="size-4 fill-[#2496ED]" />,
    label: "Docker",
    color: "bg-[#2496ED]/10 text-[#2496ED] border-[#2496ED]/20",
  },
  [TechStack.VERCEL]: {
    icon: <SI.SiVercel className="size-4 fill-[#000000] dark:fill-white" />,
    label: "Vercel",
    color:
      "bg-[#000000]/10 dark:bg-white/10 text-[#000000] dark:text-white border-[#000000] dark:border-white/10",
  },
  [TechStack.GIT]: {
    icon: <SI.SiGit className="size-4 fill-[#F05032]" />,
    label: "Git",
    color: "bg-[#F05032]/10 text-[#F05032] border-[#F05032]/20",
  },
  [TechStack.KUBERNETES]: {
    icon: <SI.SiKubernetes className="size-4 fill-[#326CE5]" />,
    label: "Kubernetes",
    color: "bg-[#326CE5]/10 text-[#326CE5] border-[#326CE5]/20",
  },
  [TechStack.LARAVEL]: {
    icon: <SI.SiLaravel className="size-4 fill-[#FF2D20]" />,
    label: "Laravel",
    color: "bg-[#FF2D20]/10 text-[#FF2D20] border-[#FF2D20]/20",
  },
  [TechStack.VUE]: {
    icon: <SI.SiVuedotjs className="size-4 fill-[#4FC08D]" />,
    label: "Vue.js",
    color: "bg-[#4FC08D]/10 text-[#4FC08D] border-[#4FC08D]/20",
  },
  [TechStack.SVELTE]: {
    icon: <SI.SiSvelte className="size-4 fill-[#FF3E00]" />,
    label: "Svelte",
    color: "bg-[#FF3E00]/10 text-[#FF3E00] border-[#FF3E00]/20",
  },
  [TechStack.THREE_JS]: {
    icon: <SI.SiSvelte className="size-4 fill-[#000000] dark:fill-white" />,
    label: "Three.js",
    color:
      "bg-[#000000]/10 dark:bg-white/10 text-[#000000] dark:text-white border-[#000000] dark:border-white/10",
  },
  [TechStack.JAVASCRIPT]: {
    icon: <SI.SiJavascript className="size-4 fill-[#F7DF1E]" />,
    label: "Javascript",
    color: "bg-[#F7DF1E]/10 text-[#F7DF1E] border-[#F7DF1E]/20 ",
  },
  [TechStack.ANGULAR]: {
    icon: <SI.SiAngular className="size-4 fill-[#0F0F11] dark:fill-white" />,
    label: "Angular",
    color:
      "bg-[#0F0F11]/10 dark:bg-white/10 text-[#0F0F11] dark:text-white border-[#0F0F11] dark:border-white/10",
  },
  [TechStack.PYTHON]: {
    icon: <SI.SiPython className="size-4 fill-[##3776AB] " />,
    label: "Python",
    color: "bg-[##3776AB]/10 text-[##3776AB]  border-[##3776AB] ",
  },
  [TechStack.DJANGO]: {
    icon: <SI.SiDjango className="size-4 fill-[#092E20] " />,
    label: "Django",
    color: "bg-[#092E20]/10  text-[#092E20]  border-[#092E20]",
  },
  [TechStack.FLASK]: {
    icon: <SI.SiFlask className="size-4 fill-[#3BABC3] " />,
    label: "Flask",
    color: "bg-[#3BABC3]/10  text-[#3BABC3]  border-[#3BABC3]",
  },
  [TechStack.GO]: {
    icon: <SI.SiGo className="size-4 fill-[#00ADD8] " />,
    label: "Go",
    color: "bg-[#00ADD8]/10  text-[#00ADD8]  border-[#00ADD8]",
  },
  [TechStack.PHP]: {
    icon: <SI.SiPhp className="size-4 fill-[#777BB4] " />,
    label: "PHP",
    color: "bg-[#777BB4]/10  text-[#777BB4]  border-[#777BB4]",
  },
  [TechStack.SQLITE]: {
    icon: <SI.SiSqlite className="size-4 fill-[#003B57] " />,
    label: "SQLite",
    color: "bg-[#003B57]/10  text-[#003B57]  border-[#003B57]",
  },
  [TechStack.DRIZZLE]: {
    icon: <SI.SiDrizzle className="size-4 fill-[#C5F74F] " />,
    label: "Drizzle",
    color: "bg-[#C5F74F]/10  text-[#C5F74F]  border-[#C5F74F]",
  },
  [TechStack.FIREBASE]: {
    icon: <SI.SiFirebase className="size-4 fill-[#DD2C00] " />,
    label: "Firebase",
    color: "bg-[#DD2C00]/10  text-[#DD2C00]  border-[#DD2C00]",
  },
  [TechStack.GOOGLE_CLOUD]: {
    icon: <SI.SiGooglecloud className="size-4 fill-[#4285F4] " />,
    label: "Google Cloud",
    color: "bg-[#4285F4]/10  text-[#4285F4]  border-[#4285F4]",
  },
  [TechStack.NETLIFY]: {
    icon: <SI.SiNetlify className="size-4 fill-[#00C7B7] " />,
    label: "Netlify",
    color: "bg-[#00C7B7]/10  text-[#00C7B7]  border-[#00C7B7]",
  },
  [TechStack.GITHUB_ACTIONS]: {
    icon: <SI.SiGithubactions className="size-4 fill-[#2088FF] " />,
    label: "Github Actions",
    color: "bg-[#2088FF]/10  text-[#2088FF]  border-[#2088FF]",
  },
  [TechStack.NGINX]: {
    icon: <SI.SiNginx className="size-4 fill-[#009639] " />,
    label: "NGINX",
    color: "bg-[#009639]/10  text-[#009639]  border-[#009639]",
  },
  [TechStack.REACT_NATIVE]: {
    icon: <SI.SiReact className="size-4 fill-[#61DAFB] " />,
    label: "React Native",
    color: "bg-[#61DAFB]/10  text-[#61DAFB]  border-[#61DAFB]",
  },
  [TechStack.FLUTTER]: {
    icon: <SI.SiFlutter className="size-4 fill-[#02569B] " />,
    label: "Flutter",
    color: "bg-[#02569B]/10  text-[#02569B]  border-[#02569B]",
  },
  [TechStack.SWIFT]: {
    icon: <SI.SiSwift className="size-4 fill-[#F05138] " />,
    label: "Swift",
    color: "bg-[#F05138]/10  text-[#F05138]  border-[#F05138]",
  },
  [TechStack.KOTLIN]: {
    icon: <SI.SiKotlin className="size-4 fill-[#7F52FF] " />,
    label: "Kotlin",
    color: "bg-[#7F52FF]/10  text-[#7F52FF]  border-[#7F52FF]",
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
      <Badge
        variant="outline"
        className="flex items-center gap-2 text-[10px] font-bold uppercase transition-all duration-300"
      >
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
