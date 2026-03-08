"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
type Task = {
  id: string;
  date: string;
  startHour: number;
  duration: number;
  title: string;
};
dayjs.extend(isoWeek);
export default function HomePage() {
  const [currentWeek, setCurrentWeek] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [showCalendar, setShowCalendar] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draggingTask, setDraggingTask] = useState<string | null>(null);
  const [resizingTask, setResizingTask] = useState<string | null>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const days = useMemo(() => {
    const startOfWeek = currentWeek.startOf("isoWeek");
    return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
  }, [currentWeek]);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const HOUR_HEIGHT = 56;
  const startOfMonth = selectedDate.startOf("month");
  const weeks: dayjs.Dayjs[][] = [];
  let day = startOfMonth.startOf("isoWeek");
  for (let w = 0; w < 6; w++) {
    const weekDays: dayjs.Dayjs[] = [];
    for (let i = 0; i < 7; i++) {
      weekDays.push(day);
      day = day.add(1, "day");
    }
    weeks.push(weekDays);
  }
  const handleClick = (day: dayjs.Dayjs) => {
    setSelectedDate(day);
  };
  const handleSelect = (d: dayjs.Dayjs) => {
    setSelectedDate(d);
    setCurrentWeek(d);
    setShowCalendar(false);
  };

  const handleMonthChange = (offset: number) => {
    setSelectedDate(selectedDate.add(offset, "month"));
  };

  const handlePrevWeek = () => setCurrentWeek(currentWeek.subtract(1, "week"));
  const handleNextWeek = () => setCurrentWeek(currentWeek.add(1, "week"));

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
  const dragInfo = useRef<{
    startY: number;
    startHour: number;
    duration: number;
  } | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const handlePointerDownTask = (e: React.PointerEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    } catch {}

    pointerIdRef.current = e.pointerId;

    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    dragInfo.current = {
      startY: e.clientY,
      startHour: task.startHour,
      duration: task.duration,
    };
    setDraggingTask(id);
  };

  const handlePointerDownResize = (e: React.PointerEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    } catch {}
    pointerIdRef.current = e.pointerId;

    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    dragInfo.current = {
      startY: e.clientY,
      startHour: task.startHour,
      duration: task.duration,
    };
    setResizingTask(id);
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!dragInfo.current) return;
    if (
      pointerIdRef.current != null &&
      (e as any).pointerId !== pointerIdRef.current
    )
      return;

    const { startY, startHour, duration } = dragInfo.current;
    const deltaY = e.clientY - startY;
    const deltaHours = Math.round(deltaY / HOUR_HEIGHT);

    if (draggingTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === draggingTask
            ? {
                ...t,
                startHour: Math.max(0, Math.min(23, startHour + deltaHours)),
              }
            : t,
        ),
      );
    } else if (resizingTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === resizingTask
            ? {
                ...t,
                duration: Math.max(
                  1,
                  Math.min(24 - startHour, duration + deltaHours),
                ),
              }
            : t,
        ),
      );
    }
  };

  const handlePointerUp = () => {
    dragInfo.current = null;
    pointerIdRef.current = null;
    setDraggingTask(null);
    setResizingTask(null);
  };

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [draggingTask, resizingTask]);
  return (
    <div>
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-neutral-200 flex flex-col justify-between invisible md:visible">
        <div>
          <div className="flex gap-2 px-6 py-5">
            <img
              src={"/images/logo.png"}
              alt="Weaver Logo"
              width={34}
              height={34}
            />
            <div className="text-2xl font-black text-gray-900 tracking-tight">
              Weaver
            </div>
          </div>

          <nav className="mt-4 flex flex-col gap-1 text-gray-600 font-medium">
            <a
              href="#"
              className="flex items-center gap-3 px-6 py-3 hover:bg-neutral-100 hover:text-black transition rounded-lg"
            >
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                />
              </svg>
              Dashboard
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-6 py-3 hover:bg-neutral-100 hover:text-black transition rounded-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 7h18M3 12h18m-7 5h7"
                />
              </svg>
              Tasks
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-6 py-3 hover:bg-neutral-100 hover:text-black transition rounded-lg"
            >
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
                />
              </svg>
              Calendar
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-6 py-3 hover:bg-neutral-100 hover:text-black transition rounded-lg"
            >
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 19V6a1 1 0 0 1 1-1h4.032a1 1 0 0 1 .768.36l1.9 2.28a1 1 0 0 0 .768.36H16a1 1 0 0 1 1 1v1M3 19l3-8h15l-3 8H3Z"
                />
              </svg>
              Projects
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-6 py-3 hover:bg-neutral-100 hover:text-black transition rounded-lg"
            >
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v15a1 1 0 0 0 1 1h15M8 16l2.5-5.5 3 3L17.273 7 20 9.667"
                />
              </svg>
              Analytics
            </a>
          </nav>
        </div>

        <div className="p-6 border-t border-neutral-200">
          <button className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition">
            + New Task
          </button>
        </div>
      </aside>
    </div>
  );
}
