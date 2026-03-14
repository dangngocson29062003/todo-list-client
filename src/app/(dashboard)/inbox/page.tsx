import { InboxDetail } from "@/src/components/inbox/inbox-detail";
import { InboxList } from "@/src/components/inbox/inbox-list";

export default function InboxPage() {
  return (
    <div className="flex h-full border-t-2">

      {/* LEFT - Inbox list */}
      <div className="w-[360px] border-r bg-background">
        <InboxList/>
      </div>

      {/* RIGHT - Email content */}
      <div className="flex-1">
        <InboxDetail/>
      </div>

    </div>
  );
}