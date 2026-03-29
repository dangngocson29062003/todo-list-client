"use client";

import { cn } from "@/src/lib/utils";
import { Check, Edit2, Loader2, X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "./shadcn/button";
import { Input } from "./shadcn/input";
import { Textarea } from "./shadcn/textarea";

interface InlineEditFieldProps {
  value: string;
  onSave?: (value: string) => Promise<void>;
  canEdit?: boolean;
  disabled?: boolean;
  className?: string;
  fieldClassName?: string;
  placeholder?: string;
  emptyText?: string;
  label?: string;
  icon?: ReactNode;
  validate?: (value: string) => string;
  renderDisplay?: (value: string) => ReactNode;
  fieldType?: "input" | "textarea";
  rows?: number;
}

export const InlineEditField = ({
  value,
  onSave,
  canEdit = true,
  disabled = false,
  className = "",
  fieldClassName = "",
  placeholder = "Provide a value...",
  emptyText = "No value provided.",
  label,
  icon,
  validate,
  renderDisplay,
  fieldType = "input",
  rows = 5,
}: InlineEditFieldProps) => {
  const [draftValue, setDraftValue] = useState<string>(value || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) {
      setDraftValue(value || "");
    }
  }, [value, isEditing]);

  const handleEdit = () => {
    if (!canEdit || disabled) return;
    setIsEditing(true);
    setError("");
    setDraftValue(value || "");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDraftValue(value || "");
    setError("");
  };

  const handleSave = async () => {
    const trimmedValue = draftValue.trim();

    if (validate) {
      const validationError = validate(trimmedValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    try {
      setIsSaving(true);
      setError("");
      await onSave?.(trimmedValue);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  const actionButtons = (
    <div className="flex items-center justify-end gap-1">
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        onClick={handleSave}
        disabled={isSaving}
        className="shrink-0 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
      >
        {isSaving ? (
          <Loader2 className="siz-4 animate-spin" />
        ) : (
          <Check className="size-4" />
        )}
      </Button>

      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        onClick={handleCancel}
        disabled={isSaving}
        className="shrink-0 p-0 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
      >
        <X className="size-4 text-red-500" />
      </Button>
    </div>
  );

  const editButton =
    canEdit && !disabled ? (
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        onClick={handleEdit}
        className="shrink-0 p-0 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <Edit2 className="size-4" />
      </Button>
    ) : null;

  return (
    <div className={cn("group", isEditing ? "w-full" : "", className)}>
      {label && (
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          {icon}
          <span>{label}</span>
          {isEditing ? actionButtons : editButton}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {isEditing ? (
          <div className="flex space-y-2 w-full">
            {fieldType === "input" ? (
              <Input
                value={draftValue}
                placeholder={placeholder}
                onChange={(e) => setDraftValue(e.target.value)}
                disabled={isSaving}
                className={cn("w-full text-sm", fieldClassName)}
              />
            ) : (
              <Textarea
                value={draftValue}
                placeholder={placeholder}
                onChange={(e) => setDraftValue(e.target.value)}
                disabled={isSaving}
                rows={rows}
                className={cn(
                  "w-full min-h-[120px] text-sm whitespace-pre-wrap break-words",
                  fieldClassName,
                )}
              />
            )}

            {!label && actionButtons}

            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            <div className={`min-w-0 ${label ? "w-full" : ""}`}>
              {renderDisplay ? (
                renderDisplay(value)
              ) : (
                <p
                  className={`${
                    fieldType === "textarea"
                      ? "text-sm whitespace-pre-wrap break-words"
                      : "text-sm truncate"
                  }
                    ${!value && "italic text-muted-foreground"}`}
                >
                  {value || emptyText}
                </p>
              )}
            </div>
            {!label && editButton}
          </div>
        )}
      </div>
    </div>
  );
};
