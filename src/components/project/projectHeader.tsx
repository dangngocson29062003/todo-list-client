import { Badge } from "../shadcn/badge";
import { Button } from "../shadcn/button";
import { Star, MoreHorizontal, Leaf } from "lucide-react";
import ProjectTabs from "./projectTab";

export default function ProjectHeader() {
  return (
    <div className="px-6 py-4 ">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600/20">
            <Leaf size={20} className="text-green-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold">
                Project Management Application
              </h2>
              <div className="mt-1 flex gap-2">
                <Badge>Spring Boot</Badge>
                <Badge>Backend</Badge>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <span>
                <strong className="text-foreground mr-2">ID:</strong> #1
              </span>

              <span>
                <strong className="text-foreground">Priority:</strong>{" "}
                <Badge variant="destructive" className="ml-2">
                  URGENT
                </Badge>
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
