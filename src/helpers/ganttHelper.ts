import {
  differenceInDays,
  addDays,
  format,
  startOfMonth,
  differenceInMonths,
  addMonths,
  startOfWeek,
  differenceInWeeks,
} from "date-fns";
import { Task } from "../types/task";

const DAY_WIDTH = 50;
const WEEK_WIDTH = 140;
const MONTH_WIDTH = 260;

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

export function getYearGroups(months: Date[]) {
  const groups: { label: string; start: number; end: number }[] = [];

  let currentYear: string | null = null;
  let start = 0;

  months.forEach((month, i) => {
    const year = format(month, "yyyy");

    if (year !== currentYear) {
      if (currentYear !== null) {
        groups.push({
          label: currentYear,
          start,
          end: i - 1,
        });
      }

      currentYear = year;
      start = i;
    }

    if (i === months.length - 1) {
      groups.push({
        label: year,
        start,
        end: i,
      });
    }
  });

  return groups;
}

export const calculateTaskLayout = (
  task: any,
  viewMode: string,
  startDate: Date,
  firstWeekStart: Date,
  startMonth: Date,
) => {
  let startOffset = 0;
  let duration = 0;
  if (viewMode === "day") {
    startOffset = differenceInDays(task.startDate, startDate) * DAY_WIDTH;

    duration = (differenceInDays(task.endDate, task.startDate) + 1) * DAY_WIDTH;
  }

  if (viewMode === "week") {
    const weekIndex = differenceInWeeks(task.startDate, firstWeekStart);

    const startOfCurrentWeek = addDays(firstWeekStart, weekIndex * 7);

    const offsetDays = differenceInDays(task.startDate, startOfCurrentWeek);

    startOffset =
      weekIndex * WEEK_WIDTH + offsetDays * (WEEK_WIDTH / 7) - WEEK_WIDTH / 7;

    duration =
      (differenceInDays(task.endDate, task.startDate) + 1) * (WEEK_WIDTH / 7);
  }

  if (viewMode === "month") {
    const daysInStartMonth = differenceInDays(
      addMonths(startOfMonth(task.startDate), 1),
      startOfMonth(task.startDate),
    );

    const monthDiff = differenceInMonths(task.startDate, startMonth);
    const dayOffsetInMonth = (task.startDate.getDate() - 1) / daysInStartMonth;

    startOffset = (monthDiff + dayOffsetInMonth) * MONTH_WIDTH;

    const taskDays = differenceInDays(task.endDate, task.startDate) + 1;
    duration = (taskDays / 30) * MONTH_WIDTH;
  }

  return { startOffset, duration };
};
