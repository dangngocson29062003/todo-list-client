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
      <div className="py-1.5 px-1.5 bg-green-200 text-green-700 rounded-md flex flex-col justify-center items-center gap-2 cursor-pointer hover:opacity-75 transition">
        <div className="font-bold leading-tight text-center">{title}</div>
        <div>
          <Badge className="bg-yellow-200 text-yellow-700">
            {startHour} - {endHour}
          </Badge>
        </div>
        <div className="w-full h-12 text-start font-normal text-muted-foreground text-xs text-wrap truncate">
          {description}
        </div>
      </div>
    </div>
  );
};
