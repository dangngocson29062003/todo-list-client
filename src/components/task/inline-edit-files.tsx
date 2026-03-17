"use client";
import { cn } from "@/src/lib/utils";
import {
  Check,
  Download,
  Edit2,
  Eye,
  Loader2,
  Paperclip,
  Trash,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../shadcn/button";
import { FileUpload } from "./file-uploads";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../shadcn/alert-dialog";

interface InlineEditDescriptionProps {
  currentFiles?: File[];
  onSave?: (value: string) => Promise<void>;
  canEdit?: boolean;
  disabled?: boolean;
  className?: string;
}
export const InlineEditFiles = ({
  currentFiles,
  onSave,
  canEdit = true,
  disabled = false,
  className = "",
}: InlineEditDescriptionProps) => {
  const [value, setValue] = useState<File[] | undefined>(currentFiles);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState(false);
  const handleEdit = () => {
    if (!canEdit || disabled) return;
    setIsEditing(true);
    setError("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValue(currentFiles);
    setError("");
  };

  const handleSave = () => {
    console.log("Save");
  };
  return (
    <div className={cn(className)}>
      <AlertDialog
        open={activeModal === "delete"}
        onOpenChange={() => setActiveModal(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete it?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Your data will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center group">
          <p className="text-xs text-muted-foreground">Attachments</p>
          {isEditing ? (
            <div>
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
          ) : (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleEdit}
              className="p-0 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          )}
        </div>
        {isEditing && <FileUpload />}
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex gap-4 items-center justify-between group transition-all">
              <div className="p-2 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-500 dark:text-blue-100">
                <Paperclip className="size-4" />
              </div>
              <div>
                <p className="text-sm text-start font-semibold">
                  Screenshot 2022-11-13 170057
                </p>
                <p className="text-xs text-start text-muted-foreground">
                  image ∙ 64KB
                </p>
              </div>
              <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="icon-xs"
                  className="cursor-pointer"
                >
                  <Eye className="size-4 " />
                </Button>
                <Button
                  variant="outline"
                  size="icon-xs"
                  className="cursor-pointer"
                >
                  <Download className="size-4 text-blue-500" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-xs"
                  className="cursor-pointer"
                  onClick={() => setActiveModal("delete")}
                >
                  <Trash className="size-4 text-red-500" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
