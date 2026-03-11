import { differenceInDays, addDays } from "date-fns";
import { Task } from "../types/task";

export const DAY_WIDTH = 36;

export function buildTree(tasks: Task[]) {
  const map = new Map<number, any>();

  tasks.forEach((t) => {
    map.set(t.id, { ...t, children: [] });
  });

  const roots: any[] = [];

  tasks.forEach((t) => {
    if (t.parentId !== null) {
      map.get(t.parentId)?.children.push(map.get(t.id));
    } else {
      roots.push(map.get(t.id));
    }
  });

  return roots;
}
export function flatten(tasks: any[], depth = 0): (Task & { depth: number })[] {
  const result: (Task & { depth: number })[] = [];

  for (const task of tasks) {
    result.push({ ...task, depth });

    if (task.expanded && task.children?.length) {
      result.push(...flatten(task.children, depth + 1));
    }
  }

  return result;
}

export function getDepth(taskId: number, tasks: Task[]): number {
  let depth = 0;
  let current = tasks.find((t) => t.id === taskId);

  while (current?.parentId !== null) {
    depth++;
    current = tasks.find((t) => t.id === current?.parentId);
  }

  return depth;
}

export function getDuration(start: Date, end: Date) {
  return differenceInDays(end, start) + 1;
}
