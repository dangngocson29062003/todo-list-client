import {
  addDays,
  addMonths,
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  format,
  startOfMonth,
} from "date-fns";
import { Task } from "../types/task";

export const DAY_WIDTH = 50;
export const WEEK_WIDTH = 140;
export const MONTH_WIDTH = 260;
export interface GanttTask extends Task {
  children: GanttTask[];
  depth: number;
}
export function buildTree(tasks: Task[]): GanttTask[] {
  const map = new Map<string, any>();

  tasks.forEach((t) => {
    map.set(t.id, { ...t, children: [] });
  });

  const roots: GanttTask[] = [];

  tasks.forEach((t) => {
    const item = map.get(t.id);
    if (t.parentId !== null) {
      const parent = map.get(t.parentId);
      if (parent) {
        parent.children.push(item);
      }
    } else {
      roots.push(item);
    }
  });
  return roots;
}

export function flatten(
  tasks: GanttTask[],
  depth = 0,
): (GanttTask & { hasChildren: boolean })[] {
  const result: any[] = [];

  for (const task of tasks) {
    const hasChildren = task.children && task.children.length > 0;
    result.push({ ...task, depth, hasChildren });
    if (task.expanded && hasChildren) {
      result.push(...flatten(task.children, depth + 1));
    }
  }

  return result;
}

export function getDepth(taskId: string, tasks: Task[]): number {
  let depth = 0;
  let current = tasks.find((t) => t.id === taskId);

  while (current?.parentId !== null) {
    depth++;
    current = tasks.find((t) => t.id === current?.parentId);
  }

  return depth;
}
export const getAllDescendantIds = (
  tasks: Task[],
  parentId: string,
): string[] => {
  let ids: string[] = [];
  const children = tasks.filter((t) => t.parentId === parentId);

  children.forEach((child) => {
    ids.push(child.id);
    ids = [...ids, ...getAllDescendantIds(tasks, child.id)];
  });

  return ids;
};
export function getMonthGroups(dates: Date[]) {
  const groups: { month: string; start: number; end: number }[] = [];

  let currentMonth: string | null = null;
  let start = 0;

  dates.forEach((date, i) => {
    const month = format(date, "yyyy-MM");

    if (month !== currentMonth) {
      if (currentMonth !== null) {
        groups.push({
          month: currentMonth,
          start,
          end: i - 1,
        });
      }

      currentMonth = month;
      start = i;
    }

    if (i === dates.length - 1) {
      groups.push({
        month,
        start,
        end: i,
      });
    }
  });

  return groups;
}
export function getWeekMonthGroups(weeks: Date[]) {
  const groups: { label: string; start: number; end: number }[] = [];
  if (weeks.length === 0) return groups;
  const getLabel = (date: Date) => format(addDays(date, 3), "MMMM yyyy");

  let currentMonthLabel = getLabel(weeks[0]);
  let startIndex = 0;

  weeks.forEach((week, index) => {
    const monthLabel = getLabel(week);

    if (monthLabel !== currentMonthLabel) {
      groups.push({
        label: currentMonthLabel,
        start: startIndex,
        end: index - 1,
      });
      currentMonthLabel = monthLabel;
      startIndex = index;
    }

    if (index === weeks.length - 1) {
      groups.push({
        label: currentMonthLabel,
        start: startIndex,
        end: index,
      });
    }
  });

  return groups;
}

export const calculateTaskLayout = (
  task: Task,
  viewMode: string,
  startDate: Date,
  firstWeekStart: Date,
  startMonth: Date,
) => {
  let startOffset = 0;
  let duration = 0;
  const sDate = new Date(task.startDate);
  const eDate = new Date(task.endDate);
  if (viewMode === "day") {
    startOffset = differenceInDays(sDate, startDate) * DAY_WIDTH;

    duration = (differenceInDays(eDate, sDate) + 1) * DAY_WIDTH;
  }

  if (viewMode === "week") {
    const weekIndex = differenceInWeeks(sDate, firstWeekStart);

    const startOfCurrentWeek = addDays(firstWeekStart, weekIndex * 7);

    const offsetDays = differenceInDays(sDate, startOfCurrentWeek);

    startOffset =
      weekIndex * WEEK_WIDTH + offsetDays * (WEEK_WIDTH / 7) - WEEK_WIDTH / 7;

    duration = (differenceInDays(eDate, sDate) + 1) * (WEEK_WIDTH / 7);
  }

  if (viewMode === "month") {
    const daysInStartMonth = differenceInDays(
      addMonths(startOfMonth(sDate), 1),
      startOfMonth(sDate),
    );

    const monthDiff = differenceInMonths(sDate, startMonth);
    const dayOffsetInMonth = (sDate.getDate() - 1) / daysInStartMonth;

    startOffset = (monthDiff + dayOffsetInMonth) * MONTH_WIDTH;

    const taskDays = differenceInDays(eDate, sDate) + 1;
    duration = (taskDays / 30) * MONTH_WIDTH;
  }

  return { startOffset, duration };
};
export const calculateTodayMarker = (
  viewMode: string,
  startDate: Date,
  firstWeekStart: Date,
  startMonth: Date,
) => {
  let todayOffset = 0;

  if (viewMode === "day") {
    todayOffset = differenceInDays(new Date(), startDate) * DAY_WIDTH + 25;
  }

  if (viewMode === "week") {
    const daysFromWeekStart = differenceInDays(new Date(), firstWeekStart);
    todayOffset = daysFromWeekStart * (WEEK_WIDTH / 7);
  }

  if (viewMode === "month") {
    const monthDiff = differenceInMonths(new Date(), startMonth);
    const daysInTodayMonth = differenceInDays(
      addMonths(startOfMonth(new Date()), 1),
      startOfMonth(new Date()),
    );
    const dayRatio = (new Date().getDate() - 1) / daysInTodayMonth;

    todayOffset = (monthDiff + dayRatio) * MONTH_WIDTH + 10;
  }
  return { todayOffset };
};
