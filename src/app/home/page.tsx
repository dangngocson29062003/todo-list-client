"use client";

import { ArrowRightCircle, CalendarCheck, Clock, FolderKanban } from "lucide-react";
import DashboardLayout from "../dashboard/layout";
import RecentlyItem from "@/src/components/home/recentlyItem";
import Link from "next/link";
import ProjectHomeCard from "@/src/components/project/projectHomeCard";
import { Carousel, CarouselContent, CarouselItem } from "@/src/components/shadcn/carousel";

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
                <Link href="/projects" className="group">
                    <div className="text-sm text-gray-400 group-hover:text-blue-500 flex items-center gap-2">
                        <FolderKanban className="h-5 w-5"></FolderKanban>
                        <span>Project Management</span>
                        <ArrowRightCircle className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" />
                    </div>
                </Link>
                    <ProjectHomeCard
                        user="Son Dang"
                        priority="URGENT"
                        date="09/03/2026"
                        title="Project Management Application"
                        category="Project workspace"
                        href={`/project/1/board`}
                    />
            </section>

            {/* Task Tracking Area */}
            <section>
                <div className="text-sm text-gray-400 flex items-center gap-2">
                    <CalendarCheck className="h-5 w-5"></CalendarCheck>
                    <span>Task Tracking</span>
                </div>
                <div className="flex flex-wrap gap-4">
                    <RecentlyItem isCreate />
                    <RecentlyItem user="Son Dang" date="09/03/2026" title="First Task" category="Task Tracking"/>
                </div>
            </section>
        </div>
      </div>
    </DashboardLayout>
  );
}