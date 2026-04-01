import { Plus, ClipboardList } from "lucide-react";
import { Button } from "../shadcn/button";

type Props = {
  onCreate: () => void;
};

export function TaskEmptyState({ onCreate }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {/* Icon */}
      <div className="mb-4 rounded-full bg-muted p-4">
        <ClipboardList className="h-8 w-8 text-muted-foreground" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold">No tasks yet</h3>

      {/* Description */}
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Start by creating your first task to organize your workflow and track
        progress.
      </p>

      {/* Button */}
      <Button className="mt-6 flex items-center gap-2" onClick={onCreate}>
        <Plus size={16} />
        Create Task
      </Button>
    </div>
  );
}
