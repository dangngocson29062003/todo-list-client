"use client";

import { RecentCarousel } from "@/src/components/home/recent-carousel";
import RecentlyItem from "@/src/components/home/recentlyItem";
import { useAuthContext } from "@/src/context/authContext";
import { useProjects } from "@/src/context/homeContext";
import { Project } from "@/src/types/project";
import { Calendars, Clock2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function HomePage() {
  const { authToken, authUser } = useAuthContext();
  const { recentProjects } = useProjects();
  const [loading, setLoading] = useState<boolean>();
  const [heroMessage, setHeroMessage] = useState({
    title: "",
    subtitle: "",
  });
  useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setHeroMessage({
        title: "Good morning!",
        subtitle:
          "Hope you had a restful start — ready to make today productive?",
      });
    } else if (hour >= 12 && hour < 18) {
      setHeroMessage({
        title: "Good afternoon!",
        subtitle:
          "Energy up — let's get things moving and make real progress today.",
      });
    } else if (hour >= 18 && hour < 22) {
      setHeroMessage({
        title: "Good evening!",
        subtitle:
          "A great time to wrap up a few important things and prepare for tomorrow.",
      });
    } else {
      setHeroMessage({
        title: "Working late?",
        subtitle:
          "Take it easy — get some rest tonight and continue tomorrow with a fresh mind.",
      });
    }
  }, []);
  return (
    <div className="max-w-7xl w-full flex flex-col flex-1 m-auto p-4">
      <div className=" w-full mb-12 text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {heroMessage.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          {heroMessage.subtitle}
        </p>
      </div>
      <div className="flex flex-col gap-10">
        <section>
          <div className="text-sm text-gray-400 flex items-center gap-1 mb-4">
            <Clock2 className="size-4"></Clock2>
            <span className="text-xs">Recently visited</span>
          </div>
          <RecentCarousel projects={recentProjects} />
        </section>
        <section>
          <div className="text-sm text-gray-400 flex items-center gap-1">
            <Calendars className="size-4"></Calendars>
            <span className="text-xs">Upcoming events</span>
          </div>
          <div className="flex flex-wrap gap-4 mt-4"></div>
        </section>
      </div>
    </div>
  );
}
