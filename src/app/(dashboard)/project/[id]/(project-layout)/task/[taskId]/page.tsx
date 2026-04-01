"use client";
import { InlineEditDate } from "@/src/components/inline-edit-date";
import { InlineEditField } from "@/src/components/inline-edit-input";
import { PriorityBadge } from "@/src/components/priority-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/shadcn/alert-dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/shadcn/avatar";
import { Badge } from "@/src/components/shadcn/badge";
import { Button } from "@/src/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/shadcn/dialog";
import { Input } from "@/src/components/shadcn/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/shadcn/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/shadcn/select";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/components/shadcn/sidebar";
import { Textarea } from "@/src/components/shadcn/textarea";
import { InlineEditAssignees } from "@/src/components/task/inline-edit-assignees";

import { InlineEditFiles } from "@/src/components/task/inline-edit-files";

import TaskTablePage from "@/src/components/task/table/task-table-page";
import {
  Timeline,
  TimelineDescription,
  TimelineHeader,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@/src/components/task/timeline";
import { Activity } from "@/src/types/activity";
import { Priority } from "@/src/types/enum";
import { Task } from "@/src/types/task";
import { format } from "date-fns";
import {
  ChartNoAxesColumnIncreasing,
  MoreHorizontal,
  Paperclip,
  RotateCw,
  Send,
  Settings2,
  TextAlignStart,
  Trash,
  TriangleAlert,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
const timelineData: Activity[] = [
  {
    id: 1,
    email: "dangngocson29062003@gmail.com",
    description: "Created a comment",
    time: new Date(),
  },
  {
    id: 2,
    email: "dangngocson29062003@gmail.com",
    description: "Created subtask",
    time: new Date(),
  },
  {
    id: 3,
    email: "dangngocson29062003@gmail.com",
    description: "Created task",
    time: new Date(),
  },
];
const data = [
  [
    {
      label: "Change status",
      icon: RotateCw,
      type: "",
    },
    {
      label: "Assign",
      icon: UsersRound,
      type: "",
    },
  ],
  [
    { label: "Edit", icon: Settings2, type: "edit" },
    { label: "Delete", icon: Trash, color: "text-red-500", type: "delete" },
  ],
];
export default function TaskPage({ task }: { task: Task }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const handleAction = (type: string) => {
    setIsOpen(false);
    setActiveModal(type);
  };
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 p-4 max-w-[1600px] mx-auto h-full">
      <Dialog
        open={activeModal === "edit"}
        onOpenChange={() => setActiveModal(null)}
      >
        <DialogContent className="max-w-7xl! w-full">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center gap-10">
              <div className="flex-1 space-y-2">
                <p className="text-xs text-muted-foreground">Title</p>
                <Input
                  defaultValue="Implement Login Feature"
                  className="text-lg font-semibold"
                />
              </div>
              <div className="flex gap-5 shrink-none">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Select defaultValue={"TODO"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TODO">To Do</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="DONE">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Priority</p>
                  <Select defaultValue={"LOW"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date Range Picker sẽ rất phù hợp ở đây */}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Description</p>
              <Textarea defaultValue="Lorem" />
            </div>

            {/* Cột phụ: Thuộc tính task */}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
      <div className="xl:col-span-8 2xl:col-span-9 space-y-6">
        <div className="bg-card border rounded-xl shadow-sm p-6 space-y-6">
          <div className="flex flex-col gap-4 border-b pb-6">
            <div className="flex justify-between items-center">
              <InlineEditField value={"Implement login feature"} />
              <div className="flex items-center gap-5">
                <p className="font-semibold text-xs text-muted-foreground">
                  Created 9 days ago
                </p>
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 data-[state=open]:bg-accent"
                    >
                      <MoreHorizontal />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-56 overflow-hidden rounded-lg p-0"
                    align="end"
                  >
                    <Sidebar collapsible="none" className="bg-transparent">
                      <SidebarContent>
                        {data.map((group, index) => (
                          <SidebarGroup
                            key={index}
                            className="border-b last:border-none"
                          >
                            <SidebarGroupContent className="gap-0">
                              <SidebarMenu>
                                {group.map((item, index) => (
                                  <SidebarMenuItem key={index}>
                                    <SidebarMenuButton
                                      onClick={() =>
                                        item.type && handleAction(item.type)
                                      }
                                    >
                                      <item.icon />
                                      <span>{item.label}</span>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                ))}
                              </SidebarMenu>
                            </SidebarGroupContent>
                          </SidebarGroup>
                        ))}
                      </SidebarContent>
                    </Sidebar>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full border">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">
                  Priority
                </span>
                <PriorityBadge priority={Priority.LOW} />
              </div>
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full border">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">
                  Status
                </span>
                <Badge variant="secondary" className="gap-1">
                  <ChartNoAxesColumnIncreasing className="size-3" /> TODO
                </Badge>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <InlineEditField
              value={
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, ab! Dolore unde sequi consequatur ipsam reprehenderit hic doloremque, qui nam veniam, autem vel provident labore dicta molestiae commodi ipsa natus!"
              }
              icon={<TextAlignStart className="size-4" />}
              label="Description"
              placeholder="Add a description to help others understand what this is about..."
              fieldType="textarea"
              renderDisplay={(value) => (
                <span className="text-sm italic text-muted-foreground">
                  {value || "No description provided for this project."}
                </span>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4 border-y border-dashed">
              <InlineEditDate value={new Date()} label="Start Date" />
              <InlineEditDate value={new Date()} label="End Date" />
            </div>
            <InlineEditAssignees />
            <InlineEditFiles />
          </div>
        </div>
        <div className="bg-card border rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Subtasks</h2>
            <Button size="sm" variant="ghost">
              Add Subtask
            </Button>
          </div>
          <TaskTablePage />
        </div>
        <div className="bg-card border rounded-xl shadow-sm p-6">
          <h2 className="font-bold">Comment</h2>
          <div className="flex-1 overflow-y-auto space-y-4">
            <div className="bg-muted-foreground/20  p-4 mt-2 rounded-md">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                    className="grayscale"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex items-center justify-between w-full">
                  <p className="flex-1 truncate text-xs">
                    dangngocson29062003@gmail.com
                  </p>
                  <p className="shrink-0 text-xs">1 minutes ago</p>
                </div>
              </div>
              <div className="text-xs mt-2 text-muted-foreground">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
                eveniet excepturi perferendis expedita inventore dolorum eaque
                fugit provident id dolor sed obcaecati dolore, delectus culpa
                commodi, nulla ratione unde doloribus!
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex gap-2 items-center">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button
                size="icon-sm"
                className="bg-blue-500 text-white dark:bg-blue-600 dark:text-white hover:bg-blue-700"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="xl:col-span-4 2xl:col-span-3">
        <div className="sticky top-4 space-y-4">
          <div className="bg-card border rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">Activity Stream</h3>
              <Badge variant="outline">{timelineData.length}</Badge>
            </div>

            <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
              <Timeline className="mt-8">
                {timelineData.map((item) => (
                  <TimelineItem key={item.id}>
                    <TimelineHeader>
                      <TimelineTime>
                        {format(item.time, "LLL dd,yyyy HH:mm")}
                      </TimelineTime>
                      <TimelineTitle>{item.email}</TimelineTitle>
                    </TimelineHeader>
                    {item.description && (
                      <TimelineDescription>
                        <h2 className="font-bold text-black dark:text-white">
                          Created a comment
                        </h2>
                        <p>
                          Lorem ipsum dolor sit, amet consectetur adipisicing
                          elit. Amet ducimus quod asperiores. Et accusantium
                          architecto est odio quidem dolore nam fuga ipsum,
                          earum at omnis tempora error odit officia eum?
                        </p>
                      </TimelineDescription>
                    )}
                  </TimelineItem>
                ))}
              </Timeline>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30 rounded-xl p-4">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              Pro Tip: Use 'Space' to quick-preview subtasks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
