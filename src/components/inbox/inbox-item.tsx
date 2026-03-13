export default function InboxItem({ name, title, preview, time } : { name: string; title: string; preview: string; time: string }) {
  return (
    <div className="cursor-pointer border-b p-4 hover:bg-muted/40">

      <div className="flex justify-between text-sm">
        <span className="font-medium">{name}</span>
        <span className="text-muted-foreground">{time}</span>
      </div>

      <p className="text-sm font-medium">{title}</p>

      <p className="text-xs text-muted-foreground truncate">
        {preview}
      </p>

    </div>
  );
}