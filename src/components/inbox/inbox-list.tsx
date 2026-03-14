import { Search } from "lucide-react";
import InboxItem from "./inbox-item";
export function InboxList() {
  return (
    <div className="h-full flex flex-col">
      {/* header */}
      <div className="p-4 border-b">
        <h2 className="font-semibold">Inbox</h2>

        <div className="relative flex items-center group mt-2 bg-muted-foreground/20 dark:bg-muted/50 rounded-md">
          <Search className="absolute left-2.5 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="search"
            placeholder="Type to search..."
            className="pl-9 pr-2 h-9 w-full text-xs border-none focus:outline-none focus:ring-0 transition-all duration-200"
          />
        </div>
      </div>

      {/* email list */}
      <div className="flex-1 overflow-auto">
        <InboxItem
          id={1}
          title="Project Management"
          name="William Smith"
          preview="Hi team, just a reminder about our meeting..."
          time="09:34 AM"
        />
      </div>
    </div>
  );
}
