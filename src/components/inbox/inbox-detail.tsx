"use client";

import { MoreVertical, Send } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/avatar";
import { Button } from "../shadcn/button";
import { Input } from "../shadcn/input";

export function InboxDetail() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col h-full overflow-hidden bg-muted dark:bg-muted/50 shadow-sm">
      {/* Chat Header */}
      <div className="p-4 border-b flex justify-between items-center ">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/avatars/user.png" />
            <AvatarFallback className="bg-green-400/20">PM</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm">Project Management</h3>
            <p className="text-xs text-muted-foreground">Group</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {/* Incoming Message */}
        <div className="flex gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-muted-foreground/20">
              OT
            </AvatarFallback>
          </Avatar>
          <div className="bg-muted-foreground/20 p-3 rounded-2xl rounded-tl-none max-w-[70%] text-sm">
            Hi! How is the progress on the Spring Boot API?
          </div>
        </div>

        {/* Outgoing Message */}
        <div className="flex gap-3 justify-end">
          <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[70%] text-sm">
            Almost done! Just finishing up the authentication endpoints.
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex gap-2 items-center">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button
            size="icon"
            className="bg-blue-500 text-white dark:bg-blue-600 dark:text-white hover:bg-blue-700"
          >
            <Send className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
