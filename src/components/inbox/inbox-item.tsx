import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/shadcn/avatar";

export default function InboxItem({
  name,
  title,
  preview,
  time,
  avatar,
}: {
  name: string;
  title: string;
  preview: string;
  time: string;
  avatar?: string;
}) {
  return (
    <div className="cursor-pointer border-b p-4 hover:bg-muted/40">
      <div className="flex gap-2">
        <Avatar
          className="h-8 w-8 border-2 border-white -ml-3 first:ml-0"
          title={name}
        >
          <AvatarImage src={avatar} />
          <AvatarFallback>{name.slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
        {/* Content */}
        <div className="flex-1 flex-col">
          <div className="flex justify-between text-md">
            <span className="font-semibold">{name}</span>
            <span className="text-muted-foreground text-sm">{time}</span>
          </div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground truncate">{preview}</p>
        </div>
      </div>
    </div>
  );
}
