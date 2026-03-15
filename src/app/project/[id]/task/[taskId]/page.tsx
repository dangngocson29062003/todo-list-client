"use client";
import { priorityColorMap } from "@/src/components/common/priority-badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/shadcn/avatar";
import { Badge } from "@/src/components/shadcn/badge";
import { Button } from "@/src/components/shadcn/button";
import { Input } from "@/src/components/shadcn/input";
import { Task } from "@/src/types/task";
import { format } from "date-fns";
import { Calendar, Send } from "lucide-react";
import { useState } from "react";

export default function TaskPage({ task }: { task: Task }) {
  const [message, setMessage] = useState("");
  return (
    <div className="grid grid-cols-[1fr_500px] gap-4 h-full pb-4">
      <div className="px-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col bg-muted rounded-md shadow">
            <div className="flex flex-col gap-1 border-b w-full p-4 ">
              <div className="flex justify-between items-center">
                <h2>Task Information</h2>
                <Badge className={`${priorityColorMap["LOW"]}`}>
                  LOW Priority
                </Badge>
              </div>
              <p className="font-semibold text-xs text-muted-foreground">
                Created 9 days ago
              </p>
            </div>
            <div className="flex flex-col gap-2 p-4">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-semibold text-sm mt-2">
                  Implement Login Feature
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="font-semibold text-sm mt-2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptates tenetur minima ipsam inventore nesciunt veritatis!
                  In veritatis omnis cumque. Nulla placeat quidem voluptate
                  minus magni sunt est, saepe neque. Maiores?
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Due Date</p>
                <p className="font-semibold text-sm! mt-2">
                  {format(new Date(), "LLL dd, y")}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-muted rounded-md">
            <div className="border-b w-full p-4">Requirements Information</div>
            <div className="p-4">
              <p className="text-sm">Name:</p>
              <span className="font-bold">Implement Login Feature</span>
              <p className="text-sm">
                Description:{" "}
                <span className="text-muted-foreground">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim
                  in, earum quia cum qui vitae officia amet atque aliquid
                  laudantium, velit ab! Cumque fuga tempora odit molestias
                  quibusdam omnis vitae.
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-col bg-muted rounded-md">
            <div className="border-b w-full p-4">Assignees Information</div>
            <div className="p-4">
              <p className="text-sm">Name:</p>
              <span className="font-bold">Implement Login Feature</span>
              <p className="text-sm">
                Description:{" "}
                <span className="text-muted-foreground">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim
                  in, earum quia cum qui vitae officia amet atque aliquid
                  laudantium, velit ab! Cumque fuga tempora odit molestias
                  quibusdam omnis vitae.
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="mt-10 p-4 bg-muted">
            <h3>Subtask</h3>
          </div>
          <div className="mt-10 p-4 bg-muted">
            <h3>File</h3>
          </div>
        </div>
        <div className="mt-10 p-4 bg-muted">
          <h3>Activities</h3>
        </div>
      </div>
      <div className="p-4 flex flex-col bg-muted h-full rounded-md">
        <h2 className="font-bold">Comment</h2>
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-muted-foreground/20 text-muted-foreground p-4 mt-2 rounded-md">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                  className="grayscale"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex items-center justify-between w-full text-black">
                <p className="flex-1 truncate text-xs">
                  dangngocson29062003@gmail.com
                </p>
                <p className="shrink-0 text-xs">1 minutes ago</p>
              </div>
            </div>
            <div className="text-xs mt-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
              eveniet excepturi perferendis expedita inventore dolorum eaque
              fugit provident id dolor sed obcaecati dolore, delectus culpa
              commodi, nulla ratione unde doloribus!
            </div>
          </div>
        </div>
        <div>
          <div className="border-t">
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
    </div>
  );
}
