"use client";
import ProjectHeader from "@/src/components/project/projectHeader";
import { useProjects } from "@/src/context/homeContext";
import { ProjectProvider } from "@/src/context/projectContext";
import { useEffect } from "react";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { refresh } = useProjects();
  useEffect(() => {
    return () => {
      refresh();
    };
  }, []);
  return (
    <ProjectProvider>
      <div>
        <ProjectHeader />
        <main className="p-6">{children}</main>
      </div>
    </ProjectProvider>
  );
}
