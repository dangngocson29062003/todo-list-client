"use client";
import { priorityColorMap } from "@/src/components/common/priority-badge";
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
import { InlineEditDate } from "@/src/components/task/inline-edit-date";
import { InlineEditDescription } from "@/src/components/task/inline-edit-description";
import { InlineEditFiles } from "@/src/components/task/inline-edit-files";
import { InlineEditTitle } from "@/src/components/task/inline-edit-title";
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
import { Task } from "@/src/types/task";
import { format } from "date-fns";
import {
  ChartNoAxesColumnIncreasing,
  MoreHorizontal,
  Paperclip,
  RotateCw,
  Send,
  Settings2,
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
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4 h-full p-2 sm:p-4 w-full overflow-x-hidden">
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

      {/* AlertDialog Delete */}
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
      <div>
        <div className="flex flex-col bg-muted rounded-md shadow p-4">
          <div className="flex flex-col gap-1 border-b w-full pb-4">
            <div className="flex justify-between items-center">
              <InlineEditTitle currentTitle="Implement Login Feature" />
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
            <div className="flex mt-2 gap-2 items-center">
              <div className="flex gap-2 items-center">
                <div className="flex gap-2 text-xs">Priority: </div>
                <Badge className={`${priorityColorMap["LOW"]} items-center`}>
                  <TriangleAlert />
                  LOW
                </Badge>
              </div>
              <div className="flex gap-2 items-center">
                <p className="text-xs">Status: </p>
                <Badge className={`${priorityColorMap["LOW"]} items-center`}>
                  <ChartNoAxesColumnIncreasing />
                  TODO
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <InlineEditDescription currentDescription="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil molestias officiis quibusdam enim minima cumque a illo aspernatur perferendis deleniti. Distinctio fugiat, labore aut perferendis ab amet repellendus eius praesentium!" />
            <div className="flex items-center gap-10">
              <InlineEditDate currentDate={new Date()} title="Start Date" />
              <InlineEditDate currentDate={new Date()} title="End Date" />
            </div>
            <InlineEditAssignees />
            <div>
              <InlineEditFiles />
            </div>
          </div>
        </div>
        <div className="mt-4 bg-muted rounded-md shadow p-4">
          <h2 className="mb-2">Subtasks</h2>
          <TaskTablePage />
        </div>
        <div className="p-4 flex flex-col bg-muted mt-4 rounded-md">
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
      <div className="bg-muted rounded-md shadow p-4">
        <h3>Activities</h3>
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
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Amet ducimus quod asperiores. Et accusantium architecto est
                    odio quidem dolore nam fuga ipsum, earum at omnis tempora
                    error odit officia eum?
                  </p>
                </TimelineDescription>
              )}
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </div>
  );
}
