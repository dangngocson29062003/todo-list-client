import {
  Copy,
  Eye,
  Link2,
  MoreHorizontalIcon,
  Pencil,
  Trash2,
  CheckCircle2,
  UserPlus,
} from "lucide-react";

import { Button } from "@/src/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/shadcn/dropdown-menu";
import { useProject } from "@/src/context/projectContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface TaskActionsProps {
  taskId: string;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function TaskActions({
  taskId,
  onDelete,
  onEdit,
  onDuplicate,
}: TaskActionsProps) {
  const router = useRouter();
  const { project } = useProject();
  const copyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/project/${project.id}/task/${taskId}`,
    );
  };

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onClick={() => router.push(`/project/${project.id}/task/${taskId}`)}
          >
            <Eye className="size-4 mr-2" />
            View details
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onEdit?.(taskId)}>
            <Pencil className="size-4 mr-2" />
            Edit task
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(taskId);
            }}
          >
            <Copy className="size-4 mr-2" />
            Duplicate task
          </DropdownMenuItem>

          <DropdownMenuItem onClick={copyLink}>
            <Link2 className="size-4 mr-2" />
            Copy link
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => console.log("Done", taskId)}>
            <CheckCircle2 className="size-4 mr-2" />
            Mark as done
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => console.log("Assign", taskId)}>
            <UserPlus className="size-4 mr-2" />
            Assign user
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete?.(taskId)}
          >
            <Trash2 className="size-4 mr-2" />
            Delete task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
