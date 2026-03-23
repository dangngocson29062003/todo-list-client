import { differenceInDays, isAfter, isBefore } from "date-fns";
export const calculateProgress = (
  startDateStr: Date | string,
  endDateStr: Date | string,
) => {
  const start = new Date(startDateStr).getTime();
  const end = new Date(endDateStr).getTime();
  const now = new Date().setHours(0, 0, 0, 0);

  if (now < start) return 0;
  if (now > end) return 100;

  const total = end - start;
  const elapsed = now - start;
  return Math.round((elapsed / total) * 100);
};
