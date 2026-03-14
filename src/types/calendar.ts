export interface Calendar {
  id: number;
  title: string;
  description: string;
  tags: string;
  priority: string;
  startDate: Date;
  endDate: Date;
  startHours: string;
  endHours: string;
  projectId: number | null;
}
