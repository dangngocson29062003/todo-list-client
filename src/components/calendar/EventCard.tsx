import { Calendar, Clock } from "lucide-react";
import { Badge } from "../shadcn/badge";

interface EventCardProps {
  id: number;
  title: string;
  description: string;
  startHour: string;
  endHour: string;
  projectId: number | null;
}
export const EventCard = ({
  id,
  title,
  description,
  startHour,
  endHour,
  projectId,
}: EventCardProps) => {
  return (
    <div className="px-2 py-2">
      <div
        className="
        bg-green-100 text-green-700
        border-l-4 border-green-500
        rounded-lg p-3
        flex flex-col gap-2
        cursor-pointer
        hover:shadow-md hover:scale-[1.02]
        transition-all
        "
      >
        {/* Title */}
        <div className="flex items-center gap-2 font-semibold text-sm">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <Calendar size={14} />
          {title}
        </div>

        {/* Time */}
        <Badge className="w-fit flex items-center gap-1 bg-yellow-200 text-yellow-700 rounded-full px-3 py-0.5">
          <Clock size={12} />
          {startHour} - {endHour}
        </Badge>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
};
