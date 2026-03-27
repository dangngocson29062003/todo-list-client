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

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => handleSelectMode("quick")}
              className="group relative flex flex-col items-start p-5 rounded-xl border-2 border-muted bg-popover hover:border-primary hover:bg-accent transition-all text-left"
            >
              <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-600 mb-4 group-hover:scale-110 transition-transform">
                <Zap className="size-6 fill-yellow-500" />
              </div>
              <h3 className="font-bold text-lg">Quick Start</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Create a project in seconds with essential fields and default
                settings.
              </p>
              <ArrowRight className="absolute bottom-5 right-5 size-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
            <button
              onClick={() => handleSelectMode("manual")}
              className="group relative flex flex-col items-start p-5 rounded-xl border-2 border-muted bg-popover hover:border-primary hover:bg-accent transition-all text-left"
            >
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <Settings2 className="size-6" />
              </div>
              <h3 className="font-bold text-lg">Manual Setup</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Configure full details including tech stack, GitHub links, figma
                and goals.
              </p>
              <ArrowRight className="absolute bottom-5 right-5 size-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
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
