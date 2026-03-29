"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import RecentlyItem from "./recentlyItem";
import { Project } from "@/src/types/project";

export function RecentCarousel({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const checkScrollPoints = () => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setIsAtStart(scrollLeft <= 0);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
    }
  };
  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    const scrollAmount = 200 + 12;
    ref.current.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    setTimeout(checkScrollPoints, 350);
  };

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  const onMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return;
    isDown = true;
    startX = e.pageX - ref.current.offsetLeft;
    scrollLeft = ref.current.scrollLeft;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    ref.current.scrollLeft = scrollLeft - walk;
  };
  const handleMouseUp = () => {
    checkScrollPoints();
  };
  useEffect(() => {
    checkScrollPoints();
    window.addEventListener("resize", checkScrollPoints);
    return () => window.removeEventListener("resize", checkScrollPoints);
  }, [projects]);
  return (
    <div className="relative">
      {!isAtStart && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 z-20 -translate-y-1/2 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg hover:bg-white transition-all"
        >
          <ChevronLeft size={20} />
        </button>
      )}
      {!isAtStart && (
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-background to-transparent" />
      )}
      <div
        ref={ref}
        className="overflow-x-auto no-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
        onMouseMove={(e) => {
          onMouseMove(e);
          checkScrollPoints();
        }}
        onScroll={checkScrollPoints}
      >
        <div className="flex gap-4 px-2">
          {projects?.map((project) => (
            <div key={project.id} className="shrink-0 ">
              <RecentlyItem project={project} />
            </div>
          ))}
        </div>
      </div>
      {!isAtEnd && (
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-background to-transparent" />
      )}
      {!isAtEnd && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 z-20 -translate-y-1/2 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg hover:bg-white transition-all"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}
