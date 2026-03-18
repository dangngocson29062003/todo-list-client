import { format } from "date-fns";
import {
  AlignLeft,
  Calendar,
  CalendarIcon,
  Clock,
  ExternalLink,
  Globe,
  LinkIcon,
  MapPin,
  MoreVertical,
  Tag,
  TextAlignStart,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/avatar";
import { Badge } from "../shadcn/badge";
import { Button } from "../shadcn/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../shadcn/drawer";

interface EventCardProps {
  id: number;
  title: string;
  description: string;
  startHour: string;
  endHour: string;
  projectId: number | null;
}
export const EventCard = ({
  id,
  title,
  description,
  startHour,
  endHour,
  projectId,
}: EventCardProps) => {
  return (
    <Drawer direction="right">
      <DrawerTrigger className="w-full">
        <div className="px-2 py-2 w-full">
          <div
            className="
            w-full bg-green-100 text-green-700 border-l-4 border-green-500 rounded-lg p-3 flex flex-col gap-2 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all"
          >
            <div className="flex items-center gap-2 font-semibold text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <Calendar size={14} />
              {title}
            </div>
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent className="">
        <DrawerHeader>
          <DrawerTitle>MEETING</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col h-full border-l border-zinc-800 text-zinc-300">
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-2 py-0">
                TODO
              </Badge>
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                AB-001
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-500"
            >
              <MoreVertical size={16} />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <section className="space-y-4">
              <h1 className="text-xl font-semibold text-white leading-tight">
                Implement Task Service Endpoints
              </h1>
              <div className="flex items-start gap-3 group">
                <TextAlignStart className="size-4 shrink-0 mt-1" />
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Establish CRUD APIs for the task management system, including
                  Prisma ORM integration and input data validation.
                </p>
              </div>
            </section>

            {/* Metadata Grid */}
            <section className="grid grid-cols-1 gap-4 py-4 border-y border-zinc-800/50">
              <div className="flex items-center gap-4 text-sm">
                <div className="w-24 flex items-center gap-2 text-zinc-500">
                  <CalendarIcon size={14} /> <span>Date</span>
                </div>
                <div className="flex-1 font-medium text-zinc-200">
                  {format(new Date(), "LLL dd, yyyy")}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="w-24 flex items-center gap-2 text-zinc-500">
                  <Clock size={14} /> <span>Time</span>
                </div>
                <div className="flex-1 font-medium text-zinc-200">
                  09:00 AM - 11:30 AM (2.5h)
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="w-24 flex items-center gap-2 text-zinc-500">
                  <Tag size={14} /> <span>Priority</span>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-500/50 text-emerald-400 bg-emerald-500/5 text-[10px]"
                >
                  MEDIUM
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="w-24 flex items-center gap-2 text-zinc-500">
                  <User size={14} /> <span>Assignees</span>
                </div>
                <div className="flex -space-x-2">
                  <Avatar className="h-6 w-6 border-2 border-[#0a0a0a]">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>S</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-6 w-6 border-2 border-[#0a0a0a]">
                    <AvatarFallback className="bg-zinc-800 text-[10px]">
                      3+
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                {/* Label chung dùng icon Globe hoặc Map để đại diện cho "Địa điểm/Phương thức" */}
                <div className="w-24 flex items-center gap-2 text-zinc-500">
                  <Globe size={14} /> <span>Mode</span>
                </div>

                {/* Hiển thị dựa trên điều kiện (Ví dụ logic) */}
                {true ? (
                  <Badge
                    variant="outline"
                    className="gap-1.5 border-sky-500/50 text-sky-400 bg-sky-500/5 text-[10px]"
                  >
                    <div className="h-1 w-1 rounded-full bg-sky-400 animate-pulse" />
                    ONLINE
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="gap-1.5 border-amber-500/50 text-amber-400 bg-amber-500/5 text-[10px]"
                  >
                    <div className="h-1 w-1 rounded-full bg-amber-400" />
                    OFFLINE
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-zinc-500 mt-0.5">
                  {true ? <LinkIcon size={14} /> : <MapPin size={14} />}
                  <span>{true ? "Meeting URL" : "Location"}</span>
                </div>

                <div className="flex-1">
                  {true ? (
                    <a
                      href={"#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:underline flex items-center gap-1.5 break-all leading-tight"
                    >
                      "https://meet.google.com/abc-xyz"
                      <ExternalLink className="shrink-0 size-4" />
                    </a>
                  ) : (
                    <span className="text-zinc-200 font-medium leading-tight">
                      "Office - 3rd Floor, Room 302"
                    </span>
                  )}
                </div>
              </div>
            </section>
          </div>
          {/* <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                <MessageSquare size={14} />
                <span>Activity</span>
              </div>

              <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-800">
                <div className="relative pl-8 text-sm">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  </div>
                  <p className="text-zinc-300">
                    <span className="font-medium text-white">Sơn Đặng</span>{" "}
                    changed status to{" "}
                    <span className="text-emerald-500">Done</span>
                  </p>
                  <span className="text-[10px] text-zinc-500">2 hours ago</span>
                </div>

                <div className="relative pl-8 text-sm">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <Avatar className="h-4 w-4">
                      <AvatarImage src="https://github.com/shadcn.png" />
                    </Avatar>
                  </div>
                  <p className="text-zinc-400">
                    <span className="font-medium text-white">Admin</span> added
                    a comment: "Please check the API docs again."
                  </p>
                  <span className="text-[10px] text-zinc-500">
                    Yesterday at 4:20 PM
                  </span>
                </div>
                <div className="relative pl-8 text-sm">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <Avatar className="h-4 w-4">
                      <AvatarImage src="https://github.com/shadcn.png" />
                    </Avatar>
                  </div>
                  <p className="text-zinc-400">
                    <span className="font-medium text-white">Admin</span> added
                    a comment: "Please check the API docs again."
                  </p>
                  <span className="text-[10px] text-zinc-500">
                    Yesterday at 4:20 PM
                  </span>
                </div>
              </div>
            </section> */}

          {/* <div className="p-4 border-t border-zinc-800">
            <div className="relative">
              <Input
                placeholder="Write a comment..."
                className="bg-zinc-900/50 border-zinc-800 focus:ring-1 focus:ring-emerald-500/50 h-10 pr-10 text-sm"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1 h-8 w-8 text-zinc-500 hover:text-white"
              >
                <CheckCircle2 size={16} />
              </Button>
            </div>
          </div> */}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
