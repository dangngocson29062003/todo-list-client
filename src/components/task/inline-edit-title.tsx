"use client";
import { cn } from "@/src/lib/utils";
import { Check, Edit2, Loader2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../shadcn/button";
import { Input } from "../shadcn/input";

interface InlineEditDescriptionProps {
  currentTitle: string;
  onSave?: (value: string) => Promise<void>;
  canEdit?: boolean;
  disabled?: boolean;
  className?: string;
}
export const InlineEditTitle = ({
  currentTitle,
  onSave,
  canEdit = true,
  disabled = false,
  className = "",
}: InlineEditDescriptionProps) => {
  const [value, setValue] = useState<string>(currentTitle);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string>("");

  const handleEdit = () => {
    if (!canEdit || disabled) return;
    setIsEditing(true);
    setError("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValue(currentTitle || "");
    setError("");
  };

  const handleSave = () => {
    console.log("Save");
  };
  return (
    <div className={cn("group", className)}>
      {isEditing ? (
        <div className={cn("space-y-3", className)}>
          <div className="flex items-center justify-end gap-1">
            <Input
              defaultValue={currentTitle}
              onChange={(e) => setValue(e.target.value)}
              className="h-9 w-84 text-sm"
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleSave}
              disabled={isSaving}
              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              disabled={isSaving}
              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
            {/* để date picker ở vị trí này */}
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">{currentTitle}</h2>
          {canEdit && !disabled && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleEdit}
              className="h-8 w-8 p-0 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
