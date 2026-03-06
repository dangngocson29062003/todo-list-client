"use client";

import { useRef, useState } from "react";
import { CalendarGrid } from "./calendar-grid";
import dayjs from "dayjs";
import { CalendarTask } from "./calendar-task";
type Task = {
  id: string;
  date: string;
  startHour: number;
  duration: number;
  title: string;
};
export function CalendarView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const dragInfo = useRef<{
    startY: number;
    startHour: number;
    duration: number;
  }>(null);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const handleAddTask = (hour: number) => {
    const title = prompt("Nhập tên task:");
    if (!title) return;

    setTasks([
      ...tasks,
      {
        id: Date.now().toString(),
        date: selectedDate.format("YYYY-MM-DD"),
        startHour: hour,
        duration: 1,
        title,
      },
    ]);
  };
  return (
    <div className="relative">
      <CalendarGrid hours={hours} handleAddTask={handleAddTask} />
      {/* {tasks
        .filter((task) => task.date === selectedDate.format("YYYY-MM-DD"))
        .map((task, key) => (
          <CalendarTask
            id={task.id}
            title={task.title}
            date={task.date}
            duration={task.duration}
            startHour={task.startHour}
            handlePointerDownResize={() => {}}
            handlePointerDownTask={() => {}}
          />
        ))} */}
    </div>
  );
}
