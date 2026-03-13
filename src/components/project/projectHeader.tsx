import { Badge } from "../shadcn/badge";
import { Button } from "../shadcn/button";
import { Star, MoreHorizontal, Leaf } from "lucide-react";
import ProjectTabs from "./projectTab";

export default function ProjectHeader() {
  return (
    <div className="px-4 md:px-6 py-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-600/20">
            <Leaf size={20} className="text-green-400" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl md:text-2xl font-semibold leading-tight">
                Project Management Application
              </h2>

              <Badge>Spring Boot</Badge>
              <Badge>Backend</Badge>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>
                <strong className="text-foreground mr-1">ID:</strong> #1
              </span>

              <span className="flex items-center">
                <strong className="text-foreground mr-1">Priority:</strong>
                <Badge variant="destructive" className="ml-1">
                  URGENT
                </Badge>
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 self-start md:self-auto">
          <Button variant="ghost" size="icon">
            <Star size={18} />
          </Button>

          <Button variant="ghost" size="icon">
            <MoreHorizontal size={18} />
          </Button>
        </div>
      </div>

      <ProjectTabs projectId="1" />
    </div>
  );
}
