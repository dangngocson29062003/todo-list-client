"use client";

<<<<<<< Updated upstream:src/app/home/page.tsx
import { CalendarCheck, Clock, FolderKanban } from "lucide-react";
import DashboardLayout from "../dashboard/layout";
=======
import { ArrowRightCircle, CalendarCheck, Clock, FolderKanban } from "lucide-react";
import DashboardLayout from "../layout";
>>>>>>> Stashed changes:src/app/(dashboard)/home/page.tsx
import RecentlyItem from "@/src/components/home/recentlyItem";

export default function HomePage() {

 
  return (
    <DashboardLayout title="Project Management & Task Tracking">
      <div className="flex flex-1 flex-col gap-4 px-20 py-10">
        <div className="text-center text-2xl mb-12">Welcome back! Ready to get things done?</div>
        <div className="flex flex-col gap-10 mx-30">
            {/* Recently Area */}
            <section>
                <div className="text-sm text-gray-400 flex items-center gap-2">
                    <Clock className="h-5 w-5"></Clock>
                    <span>Recently Visited</span>
                </div>
                <div className="flex flex-wrap gap-4">
                    <RecentlyItem isCreate />
                    <RecentlyItem user="Son Dang" date="09/03/2026" title="First Project" category="Project workspace"/>
                </div>
            </section>
            
            {/* Project Management Area */}
            <section>
                <div className="text-sm text-gray-400 flex items-center gap-2">
                    <FolderKanban className="h-5 w-5"></FolderKanban>
                    <span>Project Management</span>
                </div>
                <div className="flex flex-wrap gap-4">
                    <RecentlyItem isCreate />
                    <RecentlyItem user="Son Dang" date="09/03/2026" title="First Project" category="Project workspace"/>
                </div>
            </section>

            {/* Task Tracking Area */}
            <section>
                <div className="text-sm text-gray-400 flex items-center gap-2">
                    <CalendarCheck className="h-5 w-5"></CalendarCheck>
                    <span>Task Tracking</span>
                </div>
                <div className="flex flex-wrap gap-4">
                    <RecentlyItem isCreate />
                    <RecentlyItem user="Son Dang" date="09/03/2026" title="First Project" category="Project workspace"/>
                </div>
            </section>
        </div>
      </div>
    </DashboardLayout>
  );
}