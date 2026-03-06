interface Props {
  hours: number[];
  handleAddTask: (hour: number) => void;
}
export function CalendarGrid({ hours, handleAddTask }: Props) {
  return hours.map((h) => (
    <div
      key={h}
      onClick={() => handleAddTask(h)}
      className="relative h-14 border-t border-gray-100 pl-16 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer"
    >
      <span className="absolute left-0 top-1 text-xs text-gray-400">
        {String(h).padStart(2, "0")}:00
      </span>
    </div>
  ));
}
