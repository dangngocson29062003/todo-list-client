export default function GanttTodayMarker({
  todayOffset,
}: {
  todayOffset: number;
}) {
  return (
    <div
      className="absolute top-[calc(var(--gantt-height)*2-10px)] bottom-0 flex flex-col w-[100px] items-center z-20 select-none pointer-events-none"
      style={{
        left: todayOffset - 50,
      }}
    >
      <div className="text-[10px] text-white font-semibold p-1 bg-red-500 rounded-sm">
        Today
      </div>

      <div className="bg-red-400 w-[2px] flex-1" />
    </div>
  );
}
