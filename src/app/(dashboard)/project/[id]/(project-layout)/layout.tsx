"use client";
import { ProjectNotFound } from "@/src/components/project/project-not-found";
import ProjectHeader from "@/src/components/project/projectHeader";
import { ProjectProvider, useProject } from "@/src/context/projectContext";
import { Loader2 } from "lucide-react";

function ProjectContent({ children }: { children: React.ReactNode }) {
  const { project, loading } = useProject();
  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }
  if (!project) {
    return <ProjectNotFound />;
  }

  return (
    <div>
      <ProjectHeader />
      <main className="p-6">{children}</main>
    </div>
  );
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProjectProvider>
      <ProjectContent>{children}</ProjectContent>
    </ProjectProvider>
  );
}
