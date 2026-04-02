import { Task } from "@/src/types/task";
import { GanttTaskRowItem } from "./gantt-row-item";

type DragType = "move" | "resize-left" | "resize-right";

type Props = {
  flatTasks: Task[];
  viewMode: "day" | "week" | "month";
  changedTaskIds: string[];
  startDate: Date;
  startMonth: Date;
  firstWeekStart: Date;

  startDrag: (e: React.MouseEvent, id: string, type: DragType) => void;

  priorityColorMap: Record<string, { color: string; label: string }>;
  onReset: (id: string) => void;
  onSave: (id: string) => void;
};

export default function GanttTaskRows({
  flatTasks,
  viewMode,
  startDate,
  startMonth,
  firstWeekStart,
  changedTaskIds,
  startDrag,
  priorityColorMap,
  onReset,
  onSave,
}: Props) {
  return (
    <>
      {flatTasks.map((task) => {
        const isDirectlyChanged = changedTaskIds.includes(task.id);
        const hasChangedParent = !!(
          task.parentId && changedTaskIds.includes(task.parentId)
        );

        return (
          <GanttTaskRowItem
            key={task.id}
            task={task}
            viewMode={viewMode}
            startDate={startDate}
            startMonth={startMonth}
            firstWeekStart={firstWeekStart}
            isDirectlyChanged={isDirectlyChanged}
            hasChangedParent={hasChangedParent}
            priorityColorMap={priorityColorMap}
            startDrag={startDrag}
            onReset={onReset}
            onSave={onSave}
          />
        );
      })}
    </>
  );
}
