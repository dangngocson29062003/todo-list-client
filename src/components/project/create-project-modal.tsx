"use client";
import { ArrowRight, Settings2, Zap } from "lucide-react";
import { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../shadcn/dialog";
import { ProjectFormView } from "./project-form-view";

interface CreateProjectModalProps {
  onSuccess: () => void;
}
export function CreateProjectModal({ onSuccess }: CreateProjectModalProps) {
  const [step, setStep] = useState<"select" | "form">("select");
  const [mode, setMode] = useState<"quick" | "manual">("quick");

  const handleSelectMode = (selectedMode: "quick" | "manual") => {
    setMode(selectedMode);
    setStep("form");
  };

  return (
    <DialogContent className="sm:max-w-[800px] p-6">
      {step === "select" ? (
        <>
          <DialogHeader>
            <DialogTitle className="text-2xl">Create a new project</DialogTitle>
            <DialogDescription>
              Choose how you want to set up your project workspace.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-6">
            <button
              onClick={() => handleSelectMode("quick")}
              className="group relative flex flex-col items-start p-5 rounded-xl border border-muted bg-popover hover:border-primary/40 hover:bg-accent transition-all text-left"
            >
              <div className="p-2 rounded-lg bg-muted text-muted-foreground mb-4 group-hover:bg-accent group-hover:scale-105 group-hover:text-foreground transition-colors">
                <Zap className="size-6" />
              </div>

              <h3 className="text-lg font-semibold">Quick Start</h3>

              <p className="mt-2 text-xs text-muted-foreground">
                Create a project in seconds with essential fields and default
                settings.
              </p>

              <ArrowRight className="absolute bottom-5 right-5 size-5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
            </button>

            <button
              onClick={() => handleSelectMode("manual")}
              className="group relative flex flex-col items-start p-5 rounded-xl border border-muted bg-popover hover:border-primary/40 hover:bg-accent transition-all text-left"
            >
              <div className="p-2 rounded-lg bg-muted text-muted-foreground mb-4 group-hover:bg-accent group-hover:scale-105 group-hover:text-foreground transition-colors">
                <Settings2 className="size-6" />
              </div>

              <h3 className="text-lg font-semibold">Manual Setup</h3>

              <p className="mt-2 text-xs text-muted-foreground">
                Customize your project with tech stack, GitHub links, Figma,
                goals, and team members.
              </p>

              <ArrowRight className="absolute bottom-5 right-5 size-5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
            </button>
          </div>
        </>
      ) : (
        <ProjectFormView
          mode={mode}
          onBack={() => setStep("select")}
          onSuccess={onSuccess}
        />
      )}
    </DialogContent>
  );
}
