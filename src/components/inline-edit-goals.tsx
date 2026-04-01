"use client";

import { useEffect, useState } from "react";
import { Check, Edit2, Loader2, Target, X } from "lucide-react";
import { Button } from "@/src/components/shadcn/button";
import { cn } from "@/src/lib/utils";
import { GoalInput } from "./project/goal-input";

interface KeyObjectivesSectionProps {
  goals: string[];
  onSave?: (goals: string[]) => Promise<void>;
  canEdit?: boolean;
  disabled?: boolean;
  className?: string;
}

export function KeyObjectivesSection({
  goals,
  onSave,
  canEdit = true,
  disabled = false,
  className,
}: KeyObjectivesSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftGoals, setDraftGoals] = useState<string[]>(goals);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) {
      setDraftGoals(goals);
    }
  }, [goals, isEditing]);

  const handleEdit = () => {
    if (!canEdit || disabled) return;
    setDraftGoals(goals);
    setError("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraftGoals(goals);
    setError("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    const normalizedGoals = draftGoals
      .map((goal) => goal.trim())
      .filter(Boolean);

    try {
      setIsSaving(true);
      setError("");
      await onSave?.(normalizedGoals.length ? normalizedGoals : [""]);
      setIsEditing(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save objectives.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className={cn("group", className)}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <Target className="size-4" />
        <span>Key Objectives</span>
        {isEditing ? (
          <div className="flex items-center gap-1">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleSave}
              disabled={isSaving}
              className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
            >
              {isSaving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
            </Button>

            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              disabled={isSaving}
              className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            >
              <X className="size-4 text-red-500" />
            </Button>
          </div>
        ) : (
          canEdit &&
          !disabled && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleEdit}
              className="h-4 w-4 p-0 text-gray-400 lg:opacity-0 transition-opacity lg:group-hover:opacity-100"
            >
              <Edit2 className="size-4" />
            </Button>
          )
        )}
      </div>

      {isEditing ? (
        <GoalInput goals={draftGoals} setGoals={setDraftGoals} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {goals.filter(Boolean).map((goal, index) => (
            <div
              key={`${goal}-${index}`}
              className="flex items-center gap-3 rounded-xl bg-muted px-4 py-3 shadow-sm hover:shadow-md transition-shadow px-6 py-3"
            >
              <div className="flex size-6 items-center justify-center rounded-full bg-muted text-sm italic font-semibold text-muted-foreground">
                {index + 1}
              </div>
              <p className="text-xs italic text-muted-foreground ">{goal}</p>
            </div>
          ))}

          {!goals.filter(Boolean).length && (
            <div className="rounded-xl bg-muted px-4 py-3 text-sm italic text-muted-foreground">
              No objectives yet.
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </section>
  );
}
