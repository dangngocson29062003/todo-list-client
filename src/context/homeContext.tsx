"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getHomeData } from "../service/main-service";
import { getProjects } from "../service/project-service";
import { useNotifyContext } from "../components/notification/notificationProvider";
import { updateProjectPinStatus } from "../service/project-member-service";
import { getTasks } from "../service/task-service";
import { updateTaskPinStatus } from "../service/task-assignment-service";

interface HomeContextType {
  projects: any[];
  projectLastAccessCursor: Date | null;
  projectCreatedAtCursor: Date | null;
  projectHasNext: boolean;
  fetchProjects: () => Promise<void>;
  pinProject: (projectId: string, userId: string) => void;

  tasks: any[]
  taskLastAccessCursor: Date | null;
  taskIdCursor: number | null;
  taskHasNext: boolean;
  fetchTasks: () => Promise<void>;
  pinTask: (taskId: number, userId: string) => void;

  refetch: () => void;
}

const HomeContext = createContext<HomeContextType | null>(null);

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<any[]>([])
  const [projectLastAccessCursor, setProjectLastAccessCursor] = useState<Date | null>(null);
  const [projectCreatedAtCursor, setProjectCreatedAtCursor] = useState<Date | null>(null);
  const [projectHasNext, setProjectHasNext] = useState(true);

  const [tasks, setTasks] = useState<any[]>([])
  const [taskLastAccessCursor, setTaskLastAccessCursor] = useState<Date | null>(null);
  const [taskIdCursor, setTaskIdCursor] = useState<number | null>(null);
  const [taskHasNext, setTaskHasNext] = useState(true);

  const notify = useNotifyContext();

  const LIMIT = 6;

  const fetchData = async () => {
    try {
      const res = await getHomeData(LIMIT);
      console.log(res)
      const projectsData = res.projectsData;
      const tasksData = res.tasksData;

      setProjects(projectsData.projects);
      setProjectLastAccessCursor(projectsData.lastAccessCursor);
      setProjectCreatedAtCursor(projectsData.createdAtCursor);
      setProjectHasNext(projectsData.hasNext)

      setTasks(tasksData.tasks);
      setTaskLastAccessCursor(tasksData.lastAccessCursor);
      setTaskIdCursor(tasksData.idCursor);
      setTaskHasNext(tasksData.hasNext)
    } catch (err) {
      console.error("Failed to fetch home data", err);
      notify("error", "Failed to fetch data")
      setProjectHasNext(false);
    }
  };

  const fetchProjects = async ():Promise<void> => {
    try {
      if (!projectHasNext)
        return;

      const res = await getProjects(projectLastAccessCursor, projectCreatedAtCursor, LIMIT);
      console.log(res)
      setProjects((prev) => prev ? prev.concat(res.projects) : res.projects);
      setProjectLastAccessCursor(res.lastAccessCursor);
      setProjectCreatedAtCursor(res.createdAtCursor);
      setProjectHasNext(res.hasNext);

    } catch (err) {
      console.error("Failed to fetch projects data", err);
      notify("error", "Failed to fetch data");
      setProjectHasNext(false);
    }
  };

  const pinProject = (projectId: string, userId: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, isPinned: !p.isPinned } : p)
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) {
          return Number(b.isPinned) - Number(a.isPinned)
        }
        return 0;
      }));
    try {
      updateProjectPinStatus(projectId, userId);
    } catch {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, isPinned: !p.isPinned } : p)
        .sort((a, b) => {
          if (a.isPinned !== b.isPinned) {
            return Number(b.isPinned) - Number(a.isPinned)
          }
          return 0;
        }))
    }
  };

  const fetchTasks = async ():Promise<void> => {
    try {
      if (!taskHasNext)
        return;

      const res = await getTasks(taskLastAccessCursor, taskIdCursor, LIMIT);
      console.log(res)
      setTasks((prev) => prev ? prev.concat(res.tasks) : res.tasks);
      setTaskLastAccessCursor(res.lastAccessCursor);
      setTaskIdCursor(res.idCursor);
      setTaskHasNext(res.hasNext);

    } catch (err) {
      console.error("Failed to fetch tasks data", err);
      notify("error", "Failed to fetch data");
      setTaskHasNext(false);
    }
  };

  const pinTask = (taskId: number, userId: string) => {
    setTasks(prev => prev.map(p => p.id === taskId ? { ...p, isPinned: !p.isPinned } : p)
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) {
          return Number(b.isPinned) - Number(a.isPinned)
        }
        return 0;
      }));
    try {
      updateTaskPinStatus(taskId, userId);
    } catch {
      setTasks(prev => prev.map(p => p.id === taskId ? { ...p, isPinned: !p.isPinned } : p)
        .sort((a, b) => {
          if (a.isPinned !== b.isPinned) {
            return Number(b.isPinned) - Number(a.isPinned)
          }
          return 0;
        }))
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <HomeContext.Provider value={{
      projects, projectLastAccessCursor, projectCreatedAtCursor, projectHasNext, fetchProjects, pinProject,
      tasks, taskLastAccessCursor, taskIdCursor, taskHasNext, fetchTasks, pinTask,
      refetch: fetchData
    }}>
      {children}
    </HomeContext.Provider>
  );
}

export function useHomeContext() {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error("useHome must be used within HomeProvider");
  }
  return context;
}