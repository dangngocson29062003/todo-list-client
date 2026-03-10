"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { name: "Overview", href: "overview" },
  { name: "List", href: "list" },
  { name: "Table", href: "table"},
  { name: "Board", href: "board" },
  { name: "Timeline", href: "timeline" },
  { name: "Dashboard", href: "dashboard" },
  { name: "Calendar", href: "calendar" },
  { name: "File", href: "file" },
];

export default function ProjectTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname();

  return (
    <div className="border-b border-border mt-4">
      <div className="flex gap-6">
        {tabs.map((tab) => {
          const href = `/project/${projectId}/${tab.href}`;
          const active = pathname === href;

          return (
            <Link
              key={tab.name}
              href={href}
              className={`
                relative py-3 text-sm font-medium transition
                ${active ? "" : "text-muted-foreground hover:text-ring hover:dark:text-ring"}
              `}
            >
              {tab.name}

              {active && (
                <span className="absolute left-0 bottom-0 h-[2px] w-full bg-green-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
