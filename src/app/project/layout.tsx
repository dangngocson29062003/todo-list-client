import DashboardLayout from "@/src/app/(dashboard)/layout";
import ProjectHeader from "@/src/components/project/projectHeader";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout title="Projects">{children}</DashboardLayout>;
}
