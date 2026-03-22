"use client";
import { format } from "date-fns";
import { CalendarIcon, Check, Plus, X } from "lucide-react";
import { useState } from "react";
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
  DialogClose,
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
const USERS = [
  {
    id: "user-1",
    name: "Dang Ngoc Son",
    email: "dangngocson29062003@gmail.com",
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: "user-2",
    name: "Le Ngoc Chau Anh",
    email: "lengocchauaanh2003@gmail.com",
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: "user-3",
    name: "Do Thanh Cong",
    email: "thanhcong10@gmail.com",
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: "user-4",
    name: "Phung Van Tien Dat",
    email: "tiendat@gmail.com",
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: "user-5",
    name: "Quoc Huy",
    email: "quochuy@gmail.com",
    avatar: "https://github.com/shadcn.png",
  },
];
interface CreateTaskModalProps {
  isOpen: boolean;
  defaultStatus: TaskStatus;
  onClose: () => void;
}
export default function CreateTaskModal({
  isOpen,
  onClose,
  defaultStatus,
}: CreateTaskModalProps) {
  const [tags, setTags] = useState<string[]>(["example"]);
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>([]);

  const toggleAssignee = (userId: string) => {
    setSelectedAssigneeIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const assignedUsers = USERS.filter((user) =>
    selectedAssigneeIds.includes(user.id),
  );
  const unassignedUsers = USERS.filter(
    (user) => !selectedAssigneeIds.includes(user.id),
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = inputValue.trim();

      if (value && !tags.includes(value)) {
        setTags([...tags, value]);
        setInputValue("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full md:max-w-[70rem] w-[95vw] h-[90vh] md:h-auto flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>
          <DialogDescription>
            Create your task here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4 md:p-0 pt-2">
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_200px] gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Title</p>
                <Input placeholder="e.g. Design landing page" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Priority</p>
                <Select>
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder="Set priority level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Priority</SelectLabel>
                      {Object.values(Priority).map((status) => (
                        <SelectItem key={status} value={status as string}>
                          {taskPriorityLabels[status as Priority]}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Status</p>
                <Select>
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder="Choose status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      {Object.values(TaskStatus).map((status) => (
                        <SelectItem key={status} value={status as string}>
                          {taskStatusLabels[status as TaskStatus]}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Description</p>
              <Textarea
                className="min-h-18"
                placeholder="Describe the goals or steps to complete..."
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Tags</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-2 py-1 gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-destructive transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>

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

              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex flex-wrap gap-2">
                  <div className="flex justify-center flex-wrap gap-2 min-h-[40px]">
                    {assignedUsers.length > 0 ? (
                      assignedUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center p-1.5 gap-2 bg-secondary rounded-full border"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-[11px] font-medium pr-1">
                            {user.email}
                          </p>
                          <button
                            onClick={() => toggleAssignee(user.id)}
                            className="hover:text-destructive"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="min-h-9 min-w-0 flex items-center justify-center rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none text-muted-foreground select-none md:text-sm dark:bg-input/30 w-full">
                        No one assigned yet. Click the plus button to add
                      </div>
                    )}
                  </div>
                </div>

                <Popover open={open} onOpenChange={setOpen} modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setOpen(true)}
                      className="h-8 w-8 p-0 "
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-full p-0 shadow-2xl border-muted/40"
                    align="start"
                    sideOffset={10}
                  >
                    <Command className="rounded-lg p-4">
                      <CommandInput
                        placeholder="Search..."
                        className="border-none focus:ring-0 h-11"
                      />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Assigned" className="px-2">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {assignedUsers.map((user) => (
                              <CommandItem
                                key={user.id}
                                onSelect={() => toggleAssignee(user.id)}
                                className="flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer aria-selected:bg-accent"
                              >
                                <div className="relative">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>
                                      {user.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="absolute -top-1 -right-1 bg-black dark:bg-white text-primary-foreground p-0.5 rounded-full border-1 border-background">
                                    <Check className="size-3 font-bold text-green-200 dark:text-green-500" />
                                  </div>
                                </div>
                                <div className="flex flex-col flex-1">
                                  <p className="text-sm font-medium">
                                    {user.name}
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
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {unassignedUsers.map((user) => (
                              <CommandItem
                                key={user.id}
                                onSelect={() => toggleAssignee(user.id)}
                                className="flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                              >
                                <Avatar className="h-8 w-8 grayscale">
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback>
                                    {user.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col flex-1">
                                  <p className="text-sm font-medium">
                                    {user.name}
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

            <div className="flex justify-between md:justify-start items-center gap-6">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Start Date</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(new Date(), "LLL dd, y")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      defaultMonth={new Date()}
                      selected={new Date()}
                      onSelect={(newDate) => {
                        console.log(newDate);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">End Date</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(new Date(), "LLL dd, y")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      defaultMonth={new Date()}
                      selected={new Date()}
                      onSelect={(newDate) => {
                        console.log(newDate);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
