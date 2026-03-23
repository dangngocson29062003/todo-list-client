"use client";
import { Filter, RotateCcw } from "lucide-react";
import { Button } from "../shadcn/button";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import { Input } from "../shadcn/input";
import { Checkbox } from "../shadcn/checkbox";
import { Label } from "../shadcn/label";
import { Priority, Stage, TechStack } from "@/src/types/enum";

const PriorityLabels: Record<Priority, string> = {
  [Priority.LOW]: "Low",
  [Priority.NORMAL]: "Normal",
  [Priority.HIGH]: "High",
  [Priority.URGENT]: "Urgent",
};

const StageLabels: Record<Stage, string> = {
  [Stage.PLANNING]: "Planning",
  [Stage.DESIGN]: "Design",
  [Stage.DEVELOPMENT]: "Development",
  [Stage.TESTING]: "Testing",
  [Stage.DEPLOYMENT]: "Deployment",
  [Stage.MAINTENANCE]: "Maintenance",
  [Stage.COMPLETED]: "Completed",
  [Stage.ON_HOLD]: "On hold",
  [Stage.CANCELLED]: "Cancelled",
};

export const TechStackLabels: Record<string, string> = {
  [TechStack.NEXTJS]: "Next.js",
  [TechStack.REACT]: "React",
  [TechStack.TYPESCRIPT]: "TypeScript",
  [TechStack.TAILWIND_CSS]: "Tailwind CSS",
  [TechStack.SHADCN_UI]: "Shadcn UI",
  [TechStack.REDUX]: "Redux",
  [TechStack.ZUSTAND]: "Zustand",
  [TechStack.SPRING_BOOT]: "Spring Boot",
  [TechStack.NODEJS]: "Node.js",
  [TechStack.EXPRESS]: "Express",
  [TechStack.NESTJS]: "NestJS",
  [TechStack.JAVA]: "Java",
  [TechStack.POSTGRESQL]: "PostgreSQL",
  [TechStack.MONGODB]: "MongoDB",
  [TechStack.MYSQL]: "MySQL",
  [TechStack.PRISMA]: "Prisma",
  [TechStack.REDIS]: "Redis",
  [TechStack.DOCKER]: "Docker",
  [TechStack.AWS]: "AWS",
  [TechStack.VERCEL]: "Vercel",
  [TechStack.GIT]: "Git",
};

export default function CustomFilter() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="cursor-pointer gap-2 border-dashed"
        >
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[850px] p-6 shadow-2xl border-border/50"
        align="end"
      >
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <div className="space-y-1">
              <h4 className="font-semibold text-lg leading-none">
                Advanced Filters
              </h4>
              <p className="text-xs text-muted-foreground">
                Lọc dự án theo các tiêu chí chi tiết
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs font-medium hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <RotateCcw className="mr-2 h-3 w-3" />
              Reset All
            </Button>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Cột 1: Priority & Stage (Gom nhóm nhỏ) */}
            <div className="col-span-3 space-y-6 border-r border-border/50 pr-4">
              <div className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">
                  Priority
                </p>
                <div className="grid gap-2.5">
                  {Object.entries(PriorityLabels).map(([value, label]) => (
                    <div
                      key={value}
                      className="flex items-center space-x-2 group"
                    >
                      <Checkbox
                        id={`priority-${value}`}
                        className="border-muted-foreground/30"
                      />
                      <Label
                        htmlFor={`priority-${value}`}
                        className="text-sm font-normal cursor-pointer group-hover:text-primary transition-colors"
                      >
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">
                  Stage
                </p>
                <div className="grid gap-2.5 max-h-[180px] overflow-y-auto pr-2 scrollbar-thin">
                  {Object.entries(StageLabels).map(([value, label]) => (
                    <div
                      key={value}
                      className="flex items-center space-x-2 group"
                    >
                      <Checkbox
                        id={`stage-${value}`}
                        className="border-muted-foreground/30"
                      />
                      <Label
                        htmlFor={`stage-${value}`}
                        className="text-sm font-normal cursor-pointer group-hover:text-primary transition-colors"
                      >
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cột 2: Tech Stack (Chia 2 cột grid để cực kỳ gọn) */}
            <div className="col-span-6 space-y-3 border-r border-border/50 pr-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">
                Tech Stack
              </p>
              <div className="h-[300px] overflow-y-auto pr-4 scrollbar-thin">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {Object.entries(TechStackLabels).map(([value, label]) => (
                    <div
                      key={value}
                      className="flex items-center space-x-2 group"
                    >
                      <Checkbox
                        id={`tech-${value}`}
                        className="border-muted-foreground/30"
                      />
                      <Label
                        htmlFor={`tech-${value}`}
                        className="text-sm font-normal cursor-pointer group-hover:text-primary transition-colors whitespace-nowrap"
                      >
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cột 3: Dates & Actions */}
            <div className="col-span-3 flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">
                  Timeline
                </p>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-muted-foreground">
                      Start Date
                    </Label>
                    <Input
                      type="date"
                      className="h-9 text-xs bg-muted/20 border-none focus-visible:ring-1"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-muted-foreground">
                      End Date
                    </Label>
                    <Input
                      type="date"
                      className="h-9 text-xs bg-muted/20 border-none focus-visible:ring-1"
                    />
                  </div>
                </div>
              </div>

              <Button className="w-full font-semibold shadow-lg shadow-primary/20">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>

      {/* CSS Inline để xử lý scrollbar đẹp */}
      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #3f3f46; /* Màu slate-700 */
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #52525b; /* Màu slate-600 */
        }
      `}</style>
    </Popover>
  );
}
