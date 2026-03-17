"use client";
import { cn } from "@/src/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Check, Edit2, Loader2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../shadcn/button";
import { Calendar } from "../shadcn/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";

interface InlineEditDescriptionProps {
  title: string;
  currentDate: Date;
  onSave?: (value: string) => Promise<void>;
  canEdit?: boolean;
  disabled?: boolean;
  className?: string;
}
export const InlineEditDate = ({
  title,
  currentDate,
  onSave,
  canEdit = true,
  disabled = false,
  className = "",
}: InlineEditDescriptionProps) => {
  const [value, setValue] = useState<Date | undefined>(currentDate);
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
    setValue(currentDate || "");
    setError("");
  };

  const handleSave = () => {
    console.log("Save");
  };
  // if (isEditing) {
  //   return (

  //   );
  // }
  return (
    <div className={cn("group", className)}>
      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground">{title}</p>
        {isEditing ? (
          <div className={cn("space-y-3", className)}>
            <div className="flex items-center justify-end gap-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(currentDate, "LLL dd, y")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    defaultMonth={currentDate}
                    selected={currentDate}
                    onSelect={(newRange) => {
                      setValue(newRange);
                    }}
                  />
                </PopoverContent>
              </Popover>
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
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <p className="font-semibold text-sm text-wrap">
              {format(new Date(), "LLL dd, y")}
            </p>
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
    </div>
  );
};
