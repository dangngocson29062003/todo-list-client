import { InboxList } from "@/src/components/inbox/inbox-list";

export default function InboxPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full border-t-2">
      <div className="w-[360px] border-r bg-background">
        <InboxList />
      </div>
      {/* RIGHT - Email content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
