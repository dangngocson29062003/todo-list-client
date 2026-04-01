"use client";

import { cn } from "@/src/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Check, Edit2, Loader2, X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "@/src/components/shadcn/button";
import { Calendar } from "@/src/components/shadcn/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/shadcn/popover";

interface InlineEditDateProps {
  label: string;
  value?: Date;
  onSave?: (value?: Date) => Promise<void>;
  canEdit?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
}

export const InlineEditDate = ({
  label,
  value: propValue,
  onSave,
  canEdit = true,
  disabled = false,
  icon = true,
  className,
}: InlineEditDateProps) => {
  const [value, setValue] = useState<Date | undefined>(propValue);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) setValue(propValue);
  }, [propValue, isEditing]);

  const handleEdit = () => {
    if (!canEdit || disabled) return;
    setIsEditing(true);
    setValue(propValue);
    setError("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValue(propValue);
    setError("");
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave?.(value);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to save date");
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
        variant="ghost"
        onClick={handleEdit}
        className="w-4 h-4 shrink-0 p-0 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <Edit2 className="w-1 h-1" />
      </Button>
    ) : null;
  return (
    <div className={cn("group", className)}>
      <div className="">
        {label && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            {icon}
            <span>{label}</span>
            {isEditing ? actionButtons : editButton}
          </div>
        )}

        {isEditing ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 flex-1 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(value, "LLL dd, y") : "Pick a date"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={value}
                    onSelect={setValue}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {!label && actionButtons}
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">
                {propValue ? format(propValue, "LLL dd, y") : "No date"}
              </span>
            </div>

            {!label && editButton}
          </div>
        )}
      </div>
    </div>
  );
};
