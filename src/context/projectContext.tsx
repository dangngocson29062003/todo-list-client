"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Project } from "../types/project";
interface ProjectContextType {
  project: Project;
  loading: boolean;
  refreshProject: () => Promise<void>; // Thêm hàm này để các con có thể load lại data khi cần
}
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { id } = useParams();
  const [project, setProject] = useState<Project>();
  const [loading, setLoading] = useState(true);

  const fetchProject = async (): Promise<void> => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/projects/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch projects: ${res.statusText}`);
      }

      const result = await res.json();
      const projectsData = result.data || [];
      setProject(projectsData);
    } catch (error) {
      console.error("fetchProperties error:", error);
      setProject(undefined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  return (
    <ProjectContext.Provider
      value={{ project: project!, loading, refreshProject: fetchProject }}
    >
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <p className="animate-pulse font-bold">Loading Workspace...</p>
        </div>
      ) : (
        children
      )}
    </ProjectContext.Provider>
  );
}

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
