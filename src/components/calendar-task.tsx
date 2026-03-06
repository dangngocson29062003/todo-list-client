import React from "react";

interface Props {
  id: string;
  date: string;
  startHour: number;
  duration: number;
  title: string;
  handlePointerDownTask: (e: React.PointerEvent<Element>, id: string) => void;
  handlePointerDownResize: (e: React.PointerEvent<Element>, id: string) => void;
}
const HOUR_HEIGHT = 56;

export function CalendarTask({
  id,
  date,
  startHour,
  duration,
  title,
  handlePointerDownTask,
  handlePointerDownResize,
}: Props) {
  const top = startHour * HOUR_HEIGHT;
  const height = duration * HOUR_HEIGHT;
  return (
    <div
      key={id}
      onPointerDown={(e) => handlePointerDownTask(e, id)}
      className={`absolute left-16 right-2 rounded-lg cursor-grab active:cursor-grabbing text-white p-2 shadow-md`}
      style={{
        top: `${top}px`,
        height: `${height}px`,
        backgroundColor: "rgba(239,68,68,0.85)", // đỏ + alpha
        touchAction: "none",
      }}
    >
      <div className="font-semibold">{title}</div>
      <div className="text-xs">
        {startHour}:00 - {startHour + duration}:00
      </div>
      {/* handle resize */}
      <div
        onPointerDown={(e) => handlePointerDownResize(e, id)}
        className="absolute bottom-0 left-0 w-full h-2 bg-red-600 rounded-b-md cursor-s-resize"
        style={{ touchAction: "none" }}
      />
    </div>
  );
}
