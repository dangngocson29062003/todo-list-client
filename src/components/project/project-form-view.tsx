import { Priority, Stage } from "@/src/types/enum";
import { ProjectMember } from "@/src/types/project-member";
import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarCheck,
  CalendarClock,
  CalendarIcon,
  CircleAlert,
  Code2,
  Figma,
  Globe,
  Milestone,
  Sparkles,
  Target,
  TextAlignStart,
  TypeOutline,
} from "lucide-react";
import { useState } from "react";
import { PriorityBadge } from "../priority-badge";
import { Button } from "../shadcn/button";
import { Calendar } from "../shadcn/calendar";
import { Input } from "../shadcn/input";
import { Label } from "../shadcn/label";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../shadcn/select";
import { Textarea } from "../shadcn/textarea";
import { StageBadge } from "../stage-bade";
import { GoalInput } from "./goal-input";
import { InviteMemberForm } from "./invite-modal";
import { FancyTechInput } from "./tech-stack-input";
import { useRouter } from "next/navigation";
import { useProjects } from "@/src/context/homeContext";

interface ProjectFormViewProps {
  mode: "quick" | "manual";
  onBack: () => void;
  onSuccess: () => void;
}

export function ProjectFormView({
  mode,
  onBack,
  onSuccess,
}: ProjectFormViewProps) {
  const isQuick = mode === "quick";
  const [formData, setFormData] = useState({
    name: "",
    startDate: new Date(),
    endDate: new Date(),
    priority: Priority.NORMAL,
    stage: Stage.PLANNING,
    goals: [""] as string[],
    techStack: [] as string[],
    description: "",
    githubUrl: "",
    figmaUrl: "",
    members: [] as any[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"details" | "invite" | "success">("details");
  const [newProjectId, setNewProjectId] = useState<string | null>(null);
  const { refresh } = useProjects();
  const router = useRouter();
  const projectPriorityLabels: Record<Priority, string> = {
    [Priority.LOW]: "Low",
    [Priority.NORMAL]: "Normal",
    [Priority.HIGH]: "High",
    [Priority.URGENT]: "Urgent",
  };
  const createProject = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const payload = {
        name: formData.name,
        startDate: format(formData.startDate, "yyyy-MM-dd"),
        endDate: format(formData.endDate, "yyyy-MM-dd"),
        priority: formData.priority,
        stage: formData.stage,
        description: formData.description,
        githubUrl: formData.githubUrl,
        figmaUrl: formData.figmaUrl,
        techStack: formData.techStack,
        goals: formData.goals.filter((g) => g.trim() !== ""),
        members: formData.members.map((m) => ({
          userId: m.userId,
          role: m.role,
        })),
      };

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create project");
      }
      const result = await res.json();
      const data = result.data;
      setNewProjectId(data.id);
      setStep("success");
      refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isQuick && step === "details") {
      setStep("invite");
      return;
    }
    createProject();
  };
  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 text-center animate-in zoom-in-95 duration-300">
        <div className="size-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
          <Sparkles className="size-10 text-green-500 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Project Created!</h2>
        <p className="text-muted-foreground max-w-[280px] mb-8">
          Your project{" "}
          <span className="text-foreground font-medium">"{formData.name}"</span>{" "}
          has been set up successfully.
        </p>
        <div className="flex flex-col w-full gap-3">
          <Button
            className="w-full"
            onClick={() => {
              if (onSuccess) onSuccess();
              if (newProjectId) router.push(`/project/${newProjectId}`);
            }}
          >
            Go to Project Dashboard
          </Button>
          <Button variant="ghost" onClick={onBack}>
            Create another one
          </Button>
        </div>
      </div>
    );
  }
  if (step === "invite") {
    return (
      <div className="flex flex-col h-full max-h-[85vh] animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setStep("details")}
            className="size-8 rounded-full"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Finalize Collaboration
            </h2>
            <p className="text-xs text-muted-foreground">
              Invite your team members to start working on this project
              together.
            </p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="rounded-2xl border border-dashed border-border/60 p-1">
            <InviteMemberForm
              members={formData.members}
              onAddMember={(m) =>
                setFormData((prev) => ({
                  ...prev,
                  members: [m as ProjectMember, ...prev.members],
                }))
              }
              onRemoveMember={(email) =>
                setFormData((prev) => ({
                  ...prev,
                  members: prev.members.filter((m) => m.email !== email),
                }))
              }
              isCreateStep={true}
            />
          </div>
        </div>
        <div className="pt-6 mt-4 border-t flex justify-end items-center gap-3 bg-background">
          <p className="text-xs text-muted-foreground">
            You can always invite members later.
          </p>
          <Button
            className="shadow-lg shadow-primary/10 font-bold"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Done"}
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full max-h-[85vh] gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="size-8 rounded-full"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            {isQuick ? (
              <Sparkles className="size-4 text-yellow-500" />
            ) : (
              <Code2 className="size-4 text-blue-500" />
            )}
            {isQuick ? "Quick Start" : "Manual Configuration"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isQuick
              ? "Fill in the basics to get moving fast."
              : "Set up every detail for your team."}
          </p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 overflow-y-auto overscroll-y-auto p-2"
      >
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground mb-2 font-normal!">
            <TypeOutline className="size-4" /> Project Name
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g. Weaver Dashboard"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <Label className="text-xs text-muted-foreground mb-2 font-normal!">
              <CalendarClock className="size-4" /> Start Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="startDate"
                  variant="outline"
                  className="w-full justify-start text-left font-normal!"
                >
                  <CalendarIcon className="size-4" />
                  {format(formData.startDate, "LLL dd, y")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.startDate}
                  onSelect={(date) =>
                    setFormData({ ...formData, startDate: date as Date })
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col">
            <Label className="text-xs text-muted-foreground mb-2 font-normal!">
              <CalendarCheck className="size-4" /> End Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal!"
                >
                  <CalendarIcon className="size-4" />
                  {format(formData.endDate, "LLL dd, y")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.endDate}
                  onSelect={(date) =>
                    setFormData({ ...formData, endDate: date as Date })
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label className="text-xs text-muted-foreground mb-2 font-normal!">
              <CircleAlert className="size-4" /> Priority
            </Label>
            <Select
              value={formData.priority}
              onValueChange={(val) =>
                setFormData({ ...formData, priority: val as Priority })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Set priority level" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Priority</SelectLabel>
                  {(
                    Object.keys(projectPriorityLabels) as any as Priority[]
                  ).map((key) => (
                    <SelectItem key={key} value={`${key}`}>
                      <PriorityBadge priority={key} />
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-2 font-normal!">
              <Milestone className="size-4" />
              Stage
            </Label>
            <Select
              value={formData.stage}
              onValueChange={(val) =>
                setFormData({ ...formData, stage: val as Stage })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Project Stage</SelectLabel>
                  <SelectItem value={Stage.PLANNING}>
                    <StageBadge stage={Stage.PLANNING} />
                  </SelectItem>
                  <SelectItem value={Stage.DESIGN}>
                    <StageBadge stage={Stage.DESIGN} />
                  </SelectItem>
                  <SelectItem value={Stage.DEVELOPMENT}>
                    <StageBadge stage={Stage.DEVELOPMENT} />
                  </SelectItem>
                  <SelectItem value={Stage.MAINTENANCE}>
                    <StageBadge stage={Stage.MAINTENANCE} />
                  </SelectItem>
                  <SelectItem value={Stage.TESTING}>
                    <StageBadge stage={Stage.TESTING} />
                  </SelectItem>
                  <SelectItem value={Stage.DEPLOYMENT}>
                    <StageBadge stage={Stage.DEPLOYMENT} />
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {!isQuick && (
          <>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground mb-2 font-normal!">
                <TextAlignStart className="size-4" />
                Description
              </Label>
              <Textarea
                id="desc"
                placeholder="Briefly describe the project goals..."
                className="min-h-24 max-h-[300px]"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground mb-2 font-normal!">
                <Target className="size-4" />
                Project Goals
              </Label>
              <GoalInput
                goals={formData.goals}
                setGoals={(newGoals) =>
                  setFormData({ ...formData, goals: newGoals })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs text-muted-foreground mb-2 font-normal!">
                  <Globe className="size-3" /> GitHub URL
                </Label>
                <Input placeholder="https://github.com/..." />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs text-muted-foreground mb-2 font-normal!">
                  <Figma className="size-3" /> Figma URL
                </Label>
                <Input placeholder="https://figma.com/..." />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground mb-2 font-normal!">
                <Code2 className="size-4" />
                Technology Stack
              </Label>
              <FancyTechInput
                selected={formData.techStack}
                onAdd={(newTech) =>
                  setFormData((prev) => ({
                    ...prev,
                    techStack: [...prev.techStack, newTech],
                  }))
                }
                onRemove={(target) =>
                  setFormData((prev) => ({
                    ...prev,
                    techStack: prev.techStack.filter((t) => t !== target),
                  }))
                }
              />
            </div>
          </>
        )}

        <div className="pt-4 flex gap-3">
          <Button
            variant="outline"
            type="button"
            className="flex-1"
            onClick={onBack}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : isQuick ? "Create Project" : "Next"}
          </Button>
        </div>
      </form>
    </div>
  );
}
