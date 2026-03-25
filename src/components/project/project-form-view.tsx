import {
  ArrowLeft,
  Sparkles,
  Code2,
  Globe,
  Figma,
  CalendarIcon,
} from "lucide-react";
import { Button } from "../shadcn/button";
import { Input } from "../shadcn/input";
import { Label } from "../shadcn/label";
import { Textarea } from "../shadcn/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import { format } from "date-fns";
import { Calendar } from "../shadcn/calendar";
import { Priority } from "@/src/types/enum";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../shadcn/select";
import { FancyTechInput } from "./tech-stack-input";
import { useState } from "react";

interface ProjectFormViewProps {
  mode: "quick" | "manual";
  onBack: () => void;
  onSuccess?: () => void;
}

export function ProjectFormView({
  mode,
  onBack,
  onSuccess,
}: ProjectFormViewProps) {
  const isQuick = mode === "quick";
  const [techs, setTechs] = useState<string[]>([]);

  const projectPriorityLabels: Record<Priority, string> = {
    [Priority.LOW]: "Low",
    [Priority.NORMAL]: "Normal",
    [Priority.HIGH]: "High",
    [Priority.URGENT]: "Urgent",
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic gọi API của bạn ở đây
    console.log("Submitting data for mode:", mode);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Project Name <span className="text-destructive">*</span>
          </Label>
          <Input id="name" placeholder="e.g. Weaver Dashboard" required />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <p className="text-xs text-muted-foreground mb-2">Start Date</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal" // Thêm w-full ở đây
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(new Date(), "LLL dd, y")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-muted-foreground mb-2">End Date</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal" // Thêm w-full ở đây
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(new Date(), "LLL dd, y")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Priority</p>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Set priority level" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Priority</SelectLabel>
                  {Object.entries(projectPriorityLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Stage</p>
            <Select defaultValue="PLANNING" disabled={true}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Project Stage</SelectLabel>
                  <SelectItem value="PLANNING">Planning</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {!isQuick && (
          <>
            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                placeholder="Briefly describe the project goals..."
                className="resize-none h-24"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="size-3" /> GitHub URL
                </Label>
                <Input placeholder="https://github.com/..." />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Figma className="size-3" /> Figma URL
                </Label>
                <Input placeholder="https://figma.com/..." />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tech Stack</Label>
              <FancyTechInput
                selected={techs}
                onAdd={(newTech) => setTechs([...techs, newTech])}
                onRemove={(target) =>
                  setTechs(techs.filter((t) => t !== target))
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
          <Button type="submit" className="flex-1">
            {isQuick ? "Create Project 🚀" : "Finish Setup"}
          </Button>
        </div>
      </form>
    </div>
  );
}
