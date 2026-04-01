"use client";

import { useEffect, useState } from "react";
import { Check, Code2, Edit2, Loader2, X } from "lucide-react";
import { Button } from "@/src/components/shadcn/button";
import { cn } from "@/src/lib/utils";
import { FancyTechInput } from "./project/tech-stack-input";
import { TechBadge } from "./tech-bage";

interface InlineEditTechStackProps {
  label?: string;
  value: string[];
  onSave?: (value: string[]) => Promise<void>;
  canEdit?: boolean;
  disabled?: boolean;
  className?: string;
}

export function InlineEditTechStack({
  label = "Technology Stack",
  value,
  onSave,
  canEdit = true,
  disabled = false,
  className,
}: InlineEditTechStackProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<string[]>(value);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) setDraft(value);
  }, [value, isEditing]);

  const handleEdit = () => {
    if (!canEdit || disabled) return;
    setDraft(value);
    setError("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(value);
    setError("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError("");
      await onSave?.(draft);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to save tech stack");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className={cn("group", className)}>
      {/* Header */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <Code2 className="size-4" />
        <span>Technology Stack</span>
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

      {/* Content */}
      {isEditing ? (
        <FancyTechInput
          selected={draft}
          onAdd={(tech) => setDraft([...draft, tech])}
          onRemove={(tech) => setDraft(draft.filter((t) => t !== tech))}
        />
      ) : (
        <div className="flex flex-wrap gap-2">
          {value.length > 0 ? (
            value.map((tech) => <TechBadge key={tech} tech={tech as any} />)
          ) : (
            <p className="text-sm italic text-muted-foreground">
              No tech stack yet
            </p>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </section>
  );
}
