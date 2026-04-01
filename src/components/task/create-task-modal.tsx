"use client";

import { format } from "date-fns";
import { CalendarIcon, Check, Loader2, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/avatar";
import { Badge } from "../shadcn/badge";
import { Button } from "../shadcn/button";
import { Calendar } from "../shadcn/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../shadcn/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../shadcn/dialog";
import { Input } from "../shadcn/input";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../shadcn/select";
import { Textarea } from "../shadcn/textarea";
import { Priority, TaskStatus } from "@/src/types/enum";
import { Task } from "@/src/types/task";
import { ProjectMember } from "@/src/types/project-member";
import { useProject } from "@/src/context/projectContext";

const taskPriorityLabels: Record<Priority, string> = {
  [Priority.LOW]: "Low",
  [Priority.NORMAL]: "Normal",
  [Priority.HIGH]: "High",
  [Priority.URGENT]: "Urgent",
};

const taskStatusLabels: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: "To Do",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.REVIEW]: "Review",
  [TaskStatus.DONE]: "Done",
};

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPriority?: Priority;
  defaultStatus?: TaskStatus;
  onCreated?: (task: Task) => void;
}

type TaskFormState = {
  name: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  startDate: Date;
  endDate: Date;
  tags: string[];
};

export default function CreateTaskModal({
  isOpen,
  onClose,
  defaultPriority,
  defaultStatus,
  onCreated,
}: CreateTaskModalProps) {
  const { project } = useProject();
  const [form, setForm] = useState<TaskFormState>({
    name: "",
    description: "",
    priority: defaultPriority || Priority.LOW,
    status: TaskStatus.TODO,
    startDate: new Date(),
    endDate: new Date(),
    tags: [],
  });

  const [inputValue, setInputValue] = useState("");
  const [openAssignee, setOpenAssignee] = useState(false);
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [error, setError] = useState<string | null>(null);

  const updateForm = <K extends keyof TaskFormState>(
    key: K,
    value: TaskFormState[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      priority: defaultPriority || Priority.LOW,
      status: defaultStatus || TaskStatus.TODO,
      startDate: new Date(),
      endDate: new Date(),
      tags: [],
    });
    setInputValue("");
    setSelectedAssigneeIds([]);
    setError(null);
    setOpenAssignee(false);
  };

  useEffect(() => {
    if (project?.members) {
      setMembers(project.members);
    } else {
      setMembers([]);
    }
  }, [project]);

  useEffect(() => {
    if (isOpen) {
      setForm((prev) => ({
        ...prev,
        priority: defaultPriority || Priority.LOW,
        status: defaultStatus || TaskStatus.TODO,
      }));
      setError(null);
    }
  }, [defaultPriority, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const toggleAssignee = (userId: string) => {
    setSelectedAssigneeIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const assignedUsers = useMemo(
    () => members.filter((user) => selectedAssigneeIds.includes(user.userId)),
    [members, selectedAssigneeIds],
  );

  const unassignedUsers = useMemo(
    () => members.filter((user) => !selectedAssigneeIds.includes(user.userId)),
    [members, selectedAssigneeIds],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const value = inputValue.trim();
    if (!value) return;
    if (form.tags.includes(value)) return;

    updateForm("tags", [...form.tags, value]);
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    updateForm(
      "tags",
      form.tags.filter((tag) => tag !== tagToRemove),
    );
  };

  const handleSubmit = async () => {
    if (!project?.id) {
      setError("Project not found");
      return;
    }

    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }

    if (form.startDate > form.endDate) {
      setError("End date must be after start date");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Unauthorized");
      }
      const assignees = selectedAssigneeIds.map((userId) => ({
        userId,
      }));
      const res = await fetch(`/api/projects/${project.id}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim() || null,
          status: form.status,
          priority: form.priority,
          startDate: format(form.startDate, "yyyy-MM-dd"),
          endDate: format(form.endDate, "yyyy-MM-dd"),
          assignees,
          tags: form.tags,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to create task");
      }

      onCreated?.(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create task failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="flex h-[90vh] w-[95vw] max-w-full flex-col gap-4 md:h-auto md:max-w-[70rem]">
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>
          <DialogDescription>
            Create your task here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 pt-2 md:p-0">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_200px_200px]">
              <div>
                <p className="mb-2 text-xs text-muted-foreground">Name</p>
                <Input
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder="e.g. Design landing page"
                />
              </div>

              <div>
                <p className="mb-2 text-xs text-muted-foreground">Priority</p>
                <Select
                  value={form.priority}
                  onValueChange={(value) =>
                    updateForm("priority", value as Priority)
                  }
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder="Set priority level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Priority</SelectLabel>
                      {Object.values(Priority).map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {taskPriorityLabels[priority]}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="mb-2 text-xs text-muted-foreground">Status</p>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    updateForm("status", value as TaskStatus)
                  }
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder="Choose status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      {(Object.values(TaskStatus) as TaskStatus[]).map(
                        (status) => (
                          <SelectItem key={status} value={status}>
                            {taskStatusLabels[status]}
                          </SelectItem>
                        ),
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs text-muted-foreground">Description</p>
              <Textarea
                className="min-h-24"
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
                placeholder="Describe the goals or steps to complete..."
              />
            </div>

            <div>
              <p className="mb-2 text-xs text-muted-foreground">Tags</p>

              {form.tags.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {form.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1 px-2 py-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="transition-colors hover:text-destructive"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type and press Enter to add tags..."
                className="w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">Assignees</p>

              <div className="flex flex-col items-center gap-4 md:flex-row">
                <div className="flex flex-wrap gap-2">
                  <div className="flex min-h-[40px] flex-wrap justify-center gap-2">
                    {assignedUsers.length > 0 ? (
                      assignedUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-2 rounded-full border bg-secondary p-1.5"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatarUrl} />
                            <AvatarFallback>
                              {user.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <p className="pr-1 text-[11px] font-medium">
                            {user.email}
                          </p>
                          <button
                            type="button"
                            onClick={() => toggleAssignee(user.id)}
                            className="hover:text-destructive"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="flex min-h-9 min-w-0 w-full select-none items-center justify-center rounded-md border border-input bg-transparent px-3 py-1 text-base text-muted-foreground shadow-xs outline-none dark:bg-input/30 md:text-sm">
                        No one assigned yet. Click the plus button to add
                      </div>
                    )}
                  </div>
                </div>

                <Popover
                  open={openAssignee}
                  onOpenChange={setOpenAssignee}
                  modal={true}
                >
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-full border-muted/40 p-0 shadow-2xl"
                    align="start"
                    sideOffset={10}
                  >
                    <Command className="rounded-lg p-4">
                      <CommandInput
                        placeholder="Search..."
                        className="h-11 border-none focus:ring-0"
                      />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>

                        <CommandGroup heading="Assigned" className="px-2">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {assignedUsers.map((user) => (
                              <CommandItem
                                key={user.id}
                                onSelect={() => toggleAssignee(user.userId)}
                                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 aria-selected:bg-accent"
                              >
                                <div className="relative">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.avatarUrl} />
                                    <AvatarFallback>
                                      {user.email.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="absolute -right-1 -top-1 rounded-full border-1 border-background bg-black p-0.5 text-primary-foreground dark:bg-white">
                                    <Check className="size-3 font-bold text-green-200 dark:text-green-500" />
                                  </div>
                                </div>
                                <div className="flex flex-1 flex-col">
                                  <p className="text-sm font-medium">
                                    {user.fullName}
                                  </p>
                                  <p className="text-[11px] text-muted-foreground">
                                    {user.email}
                                  </p>
                                </div>
                              </CommandItem>
                            ))}
                          </div>
                        </CommandGroup>

                        <CommandGroup heading="Unassigned" className="px-2">
                          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                            {unassignedUsers.map((user) => (
                              <CommandItem
                                key={user.id}
                                onSelect={() => toggleAssignee(user.userId)}
                                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 opacity-70 transition-opacity hover:opacity-100"
                              >
                                <Avatar className="h-8 w-8 grayscale">
                                  <AvatarImage src={user.avatarUrl} />
                                  <AvatarFallback>
                                    {user.email.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-1 flex-col">
                                  <p className="text-sm font-medium">
                                    {user.fullName}
                                  </p>
                                  <p className="text-[11px] text-muted-foreground">
                                    {user.email}
                                  </p>
                                </div>
                              </CommandItem>
                            ))}
                          </div>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex items-center justify-between gap-6 md:justify-start">
              <div>
                <p className="mb-2 text-xs text-muted-foreground">Start Date</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.startDate
                        ? format(form.startDate, "LLL dd, y")
                        : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      defaultMonth={form.startDate}
                      selected={form.startDate}
                      onSelect={(date) => {
                        if (date) updateForm("startDate", date);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <p className="mb-2 text-xs text-muted-foreground">End Date</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.endDate
                        ? format(form.endDate, "LLL dd, y")
                        : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      defaultMonth={form.endDate}
                      selected={form.endDate}
                      onSelect={(date) => {
                        if (date) updateForm("endDate", date);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            disabled={submitting}
          >
            Cancel
          </Button>

          <Button type="button" onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
