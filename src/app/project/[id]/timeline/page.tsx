"use client";
// import { Task, TaskStatus } from "@/src/types/task";
import { useTheme } from "next-themes";
import React, { useState } from "react";
import { GanttChart, Task, TaskGroup } from "react-modern-gantt";
import "react-modern-gantt/dist/index.css";
import "@/src/styles/gantt-custom.css";
export default function TimeLine() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const task: TaskGroup[] = [
    {
      id: "project-1",
      name: "Project Tasks",
      description: "Development Team",
      tasks: [
        {
          id: "1",
          name: "Design login page",
          startDate: new Date(2026, 2, 10),
          endDate: new Date(2026, 2, 14),
          color: "#3B82F6",
          percent: 45,
        },
        {
          id: "2",
          name: "Setup Spring Boot API",
          startDate: new Date(2026, 2, 9),
          endDate: new Date(2026, 2, 15),
          color: "#3B82F6",
          percent: 45,
        },
        {
          id: "3",
          name: "Implement task service",
          startDate: new Date(2026, 2, 16),
          endDate: new Date(2026, 2, 20),
          color: "#3B82F6",
          percent: 45,
        },
        {
          id: "4",
          name: "Connect frontend with API",
          startDate: new Date(2026, 2, 12),
          endDate: new Date(2026, 2, 21),
          color: "#3B82F6",
          percent: 45,
        },
        {
          id: "5",
          name: "Add drag and drop",
          startDate: new Date(2026, 2, 10),
          endDate: new Date(2026, 2, 14),
          color: "#3B82F6",
          progress: 45,
        },
        {
          id: "6",
          name: "Implement Timeline view",
          startDate: new Date(2026, 3, 10),
          endDate: new Date(2026, 3, 14),
          color: "#3B82F6",
          progress: 45,
        },
      ],
    },
  ];
  const handleTaskUpdate = (groupId: any, updatedTask: any) => {
    // Update your task data here
    console.log("Task updated:", updatedTask);
  };
  return (
    <div className="p-4">
      <div className="w-full">
        <GanttChart
          tasks={task}
          // startDate={new Date(2026, 2, 1)}
          // endDate={new Date(2026, 3, 5)}
          locale=""
          viewMode="day"
          title="Project Timeline"
          showTodayMarker
          todayLabel="Today"
          onTaskUpdate={handleTaskUpdate}
        />
      </div>
    </div>
  );
}
