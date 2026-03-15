import InboxItem from "./inbox-item";
export function InboxList() {
  return (
    <div className="h-full flex flex-col">

      {/* header */}
      <div className="p-4 border-b">
        <h2 className="font-semibold">Inbox</h2>

        <input
          placeholder="Type to search..."
          className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      {/* email list */}
      <div className="flex-1 overflow-auto">

        <InboxItem
<<<<<<< Updated upstream
=======
          title="Project Management"
>>>>>>> Stashed changes
          name="William Smith"
          title="Meeting Tomorrow"
          preview="Hi team, just a reminder about our meeting..."
          time="09:34 AM"
        />

        <InboxItem
          name="Alice Smith"
          title="Re: Project Update"
          preview="Thanks for the update..."
          time="Yesterday"
        />

      </div>

    </div>
  );
}