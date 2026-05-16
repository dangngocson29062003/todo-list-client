import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { vi } from "date-fns/locale";

export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "Unexpected error occurred";
}
export function formatLastActive(dateString: Date) {
  const date = new Date(dateString);

  if (isToday(date)) {
    return `Today at ${format(date, "hh:mm a")}`;
  }

  if (isYesterday(date)) {
    return `Yesterday at ${format(date, "hh:mm a")}`;
  }

  return format(date, "MMM d, yyyy 'at' hh:mm a");
}

export function formatDateDistanceToNow(date: string) {
  const createdAt = new Date(date);

  return formatDistanceToNow(createdAt, { addSuffix: true });
}
