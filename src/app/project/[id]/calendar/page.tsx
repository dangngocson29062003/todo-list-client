"use client";
import { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { EventCard } from "@/src/components/calendar/EventCard";
import { Calendar as CalendarType } from "@/src/types/calendar";
import {
  addMonths,
  format,
  getDay,
  isSameDay,
  parse,
  startOfWeek,
  subMonths,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/src/styles/data-calendar.css";
import { Button } from "@/src/components/shadcn/button";
import { Badge } from "@/src/components/shadcn/badge";
const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
const initialCalendar: CalendarType[] = [
  {
    id: 1,
    title: "Meeting",
    description: "Progress reports",
    tags: "frontend,ui",
    priority: "HIGH",
    startDate: new Date(2026, 2, 10),
    endDate: new Date(2026, 2, 10),
    startHours: "1 P.M",
    endHours: "2 P.M",
    projectId: 1,
  },
  {
    id: 2,
    title: "Meeting",
    description:
      "Progress reports Progress reportsProgress reportsProgress reportsProgress reportsProgress reportsProgress reportsProgress reports",
    tags: "frontend,ui",
    priority: "HIGH",
    startDate: new Date(2026, 2, 10),
    endDate: new Date(2026, 2, 10),
    startHours: "1 P.M",
    endHours: "2 P.M",
    projectId: 1,
  },
];

interface CustomToolBarProps {
  date: Date;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
}

const CustomToolBar = ({ date, onNavigate }: CustomToolBarProps) => {
  return (
    <div className="flex mb-4 gap-x-2 items-center w-full lg:w-auto justify-center lg:justify-start">
      <Button
        variant={"outline"}
        size={"icon-sm"}
        onClick={() => onNavigate("PREV")}
      >
        <ChevronLeft className="size-4" />
      </Button>
      <div className="flex items-center border border-input rounded-md px-3 py-2 h-8 justify-center w-full lg:w-auto">
        <CalendarIcon className="size-4 mr-2" />
        <p className="text-sm">{format(date, "MMMM yyyy")}</p>
      </div>
      <Button
        variant={"outline"}
        size={"icon-sm"}
        onClick={() => onNavigate("NEXT")}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
};

export default function CalendarPage() {
  const [value, setValue] = useState(
    initialCalendar.length > 0
      ? new Date(initialCalendar[0].startDate)
      : new Date(),
  );
  const events = initialCalendar.map((calendar) => ({
    start: new Date(calendar.startDate),
    end: new Date(calendar.endDate),
    startHour: calendar.startHours,
    endHour: calendar.endHours,
    description: calendar.description,
    title: calendar.title,
    projectId: calendar.projectId,
    id: calendar.id,
  }));
  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    if (action === "PREV") {
      setValue(subMonths(value, 1));
    } else if (action === "NEXT") {
      setValue(addMonths(value, 1));
    } else if (action === "TODAY") {
      setValue(new Date());
    }
  };
  return (
    <div className="px-4 pb-4">
      <Calendar
        localizer={localizer}
        date={value}
        events={events}
        views={["month"]}
        defaultView="month"
        toolbar
        showAllEvents
        className="h-full bg-muted dark:bg-muted/50 p-4 rounded-md"
        max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
        formats={{
          weekdayFormat: (date, culture, localizer) =>
            localizer?.format(date, "EEE", culture) ?? "",
        }}
        components={{
          eventWrapper: ({ event }) => (
            <EventCard
              id={event.id}
              title={event.title}
              description={event.description}
              startHour={event.startHour}
              endHour={event.endHour}
              projectId={event.projectId}
            />
          ),
          toolbar: () => (
            <CustomToolBar date={value} onNavigate={handleNavigate} />
          ),
          month: {
            dateHeader: ({ label, date }: any) => {
              const eventsCount = events.filter((event) =>
                isSameDay(new Date(event.start), date),
              ).length;

              return (
                <div className="flex justify-end items-center gap-2">
                  {eventsCount > 0 && (
                    <Badge className="bg-red-200 text-red-800">
                      {eventsCount}
                    </Badge>
                  )}
                  <span>{label}</span>
                </div>
              );
            },
          },
        }}
      />
    </div>
  );
}
