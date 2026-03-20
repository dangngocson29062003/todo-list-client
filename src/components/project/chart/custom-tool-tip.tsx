import { Avatar, AvatarFallback, AvatarImage } from "../../shadcn/avatar";

export const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-3 shadow-md outline-none">
        <div className="flex items-center gap-2 mb-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>
              {data.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-none">{data.name}</span>
            <span className="text-xs text-muted-foreground mt-1">
              {data.email}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 border-t pt-2">
          <span className="text-xs text-muted-foreground font-medium">
            Tasks Assigned:
          </span>
          <span
            className="text-sm font-mono font-bold"
            style={{ color: data.fill }}
          >
            {data.tasks}
          </span>
        </div>
      </div>
    );
  }
  return null;
};
