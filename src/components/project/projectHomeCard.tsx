import {
  ArrowRightCircle,
  File,
  FilePlus,
  Leaf,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "../shadcn/badge";

export default function ProjectHomeCard({
  user,
  date,
  title,
  category,
  isCreate,
  href,
  priority,
}: {
  user?: string;
  date?: string;
  title?: string;
  category?: string;
  isCreate?: boolean;
  href?: string;
  priority?: string;
}) {
  if (isCreate) {
    return (
      <div className="w-full relative max-w-46 h-40 border-2 border-dashed rounded-sm border-gray-300 mt-4 cursor-pointer group hover:border-green-600 hover:shadow-md transition-all duration-200">
        <div className="p-3 flex flex-col gap-2 mt-2">
          <div className="flex items-start gap-2">
            <div>
              <FilePlus className="h-5 w-5 text-gray-500 group-hover:text-green-600 mt-0.5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-medium truncate group-hover:text-green-600 transition-all">
                Create
              </span>

              <span className="text-xs text-gray-400 mt-1">
                Create a new project, task or workspace or anything you want.
              </span>
            </div>
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 absolute bottom-3 right-3 text-green-600 transition">
          <PlusCircle className="h-5 w-5" />
        </div>
      </div>
    );
  }
  return (
    <div className="w-full relative max-w-85 h-55 border-2 rounded-sm border-gray-300 mt-4 cursor-pointer group hover:border-blue-600 hover:shadow-md transition-all duration-200">
      <Link href={href || "#"} className="w-full h-full">
        <div className="flex border-b text-xs justify-between py-3 px-2 items-center">
          <div className="flex items-center gap-1 min-w-0">
            <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
              D
            </div>
            <span className="truncate w-full">{user}</span>
          </div>
          <Badge
            className={`text-xs col-start-2 ${
              priority === "URGENT"
                ? "bg-red-200 text-red-700"
                : priority === "HIGH"
                  ? "bg-yellow-200 text-yellow-700"
                  : priority === "MEDIUM"
                    ? "bg-green-200 text-green-700"
                    : priority === "LOW"
                      ? "bg-blue-200 text-blue-700"
                      : "bg-gray-200 text-gray-700"
            }`}
          >
            {priority}
          </Badge>
        </div>
        <div className="p-3 flex flex-col gap-2 mt-2">
          <div className="grid grid-cols-[2fr_auto_2fr] items-start gap-3 w-full">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600/20">
              <Leaf size={20} className="text-green-400" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-medium">{title}</span>
              <span className="text-xs text-gray-400 mt-1 truncate">
                {category}
              </span>
              <div className="flex gap-1 mt-2">
                <Badge>Spring Boot</Badge>
                <Badge>Backend</Badge>
              </div>
            </div>
            <span className="text-gray-400 text-xs">{date}</span>
          </div>
        </div>
      </Link>
      <div className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 absolute bottom-3 right-3 text-blue-600 transition">
        <ArrowRightCircle className="h-5 w-5" />
      </div>
    </div>
  );
}
