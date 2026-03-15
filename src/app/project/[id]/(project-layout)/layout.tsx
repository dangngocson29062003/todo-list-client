import ProjectHeader from "@/src/components/project/projectHeader";
import DashboardLayout from "../../../(dashboard)/layout";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ProjectHeader />

      {children}
    </div>
  );
}
