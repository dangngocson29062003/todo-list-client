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
            : t
        )
      );
    } else if (resizingTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === resizingTask
            ? {
                ...t,
                duration: Math.max(
                  1,
                  Math.min(24 - startHour, duration + deltaHours)
                ),
              }
            : t
        )
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

      <main className="md:ml-64 bg-gray-50 ">
        <div className="p-10 min-h-screen">
          <div className="flex items-center justify-center mb-4">
            <div className="flex gap-2 justify-center items-center">
              <button
                onClick={handlePrevWeek}
                className="md:px-3 md:py-1 hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6 "
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
                    d="m15 19-7-7 7-7"
                  />
                </svg>
              </button>
              <div
                className="flex items-center gap-2"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <h2 className="text-md md:text-lg font-semibold">
                  {days[0].format("DD MMM")} - {days[6].format("DD MMM YYYY")}
                </h2>
              </div>
              <button
                onClick={handleNextWeek}
                className="md:px-3 md:py-1 hover:bg-gray-100"
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
                    d="m9 5 7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            {showCalendar && (
              <div
                ref={ref}
                className="absolute top-12   w-72 bg-white border border-gray-200 rounded-2xl shadow-lg p-4 animate-in fade-in slide-in-from-top-2 z-50"
              >
                <div className="flex justify-between items-center mb-3">
                  <button
                    onClick={() => handleMonthChange(-1)}
                    className="p-1 hover:bg-gray-100 rounded-md"
                  >
                    ←
                  </button>
                  <span className="font-semibold text-gray-800 text-sm">
                    {selectedDate.format("MMMM YYYY")}
                  </span>
                  <button
                    onClick={() => handleMonthChange(1)}
                    className="p-1 hover:bg-gray-100 rounded-md"
                  >
                    →
                  </button>
                </div>

                <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 mb-1">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <div key={d}>{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 text-sm">
                  {weeks.map((week, wi) =>
                    week.map((d) => {
                      const isCurrentMonth = d.month() === selectedDate.month();
                      const isToday = d.isSame(dayjs(), "day");
                      const isSelected = d.isSame(currentWeek, "day");

                      return (
                        <div
                          key={d.format("YYYY-MM-DD") + wi}
                          onClick={() => handleSelect(d)}
                          className={`flex items-center justify-center h-8 w-8 rounded-lg cursor-pointer transition
                        ${
                          !isCurrentMonth
                            ? "text-gray-300"
                            : isSelected
                            ? "bg-blue-500 text-white"
                            : isToday
                            ? "text-blue-500 border border-blue-300"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                        >
                          {d.date()}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between w-full">
            {days.map((d) => {
              const isSelected = selectedDate.isSame(d, "day");
              return (
                <div
                  key={d.format("YYYY-MM-DD")}
                  onClick={() => handleClick(d)}
                  className={`cursor-pointer rounded-md md-p-4 transition text-gray-400 flex flex-col items-center
              ${isSelected ? "text-gray-900" : "hover:bg-gray-100"}`}
                >
                  <div className="text-2xl md:text-4xl font-black">
                    {d.format("DD")}
                  </div>
                  <div className="text-lg uppercase">{d.format("ddd")}</div>
                </div>
              );
            })}
          </div>
          <div className="border rounded-lg bg-white shadow-sm p-4">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">
              {selectedDate.format("dddd, DD MMMM YYYY")}
            </h2>

            <div className="relative border-t border-gray-200">
              {hours.map((h) => (
                <div
                  key={h}
                  onClick={() => handleAddTask(h)}
                  className="relative h-14 border-t border-gray-100 pl-16 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer"
                >
                  <span className="absolute left-0 top-1 text-xs text-gray-400">
                    {String(h).padStart(2, "0")}:00
                  </span>
                </div>
              ))}

              {/* Tasks */}
              {tasks
                .filter((t) => t.date === selectedDate.format("YYYY-MM-DD"))
                .map((t) => {
                  const top = t.startHour * HOUR_HEIGHT;
                  const height = t.duration * HOUR_HEIGHT;
                  return (
                    <div
                      key={t.id}
                      onPointerDown={(e) => handlePointerDownTask(e, t.id)}
                      className={`absolute left-16 right-2 rounded-lg cursor-grab active:cursor-grabbing text-white p-2 shadow-md`}
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        backgroundColor: "rgba(239,68,68,0.85)", // đỏ + alpha
                        touchAction: "none",
                      }}
                    >
                      <div className="font-semibold">{t.title}</div>
                      <div className="text-xs">
                        {t.startHour}:00 - {t.startHour + t.duration}:00
                      </div>
                      {/* handle resize */}
                      <div
                        onPointerDown={(e) => handlePointerDownResize(e, t.id)}
                        className="absolute bottom-0 left-0 w-full h-2 bg-red-600 rounded-b-md cursor-s-resize"
                        style={{ touchAction: "none" }}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
