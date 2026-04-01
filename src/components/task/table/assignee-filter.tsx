import { Check, Funnel, FunnelPlus, UserPlus, UsersRound } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../../shadcn/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../shadcn/command";
import { Avatar, AvatarFallback, AvatarImage } from "../../shadcn/avatar";
import { ProjectMember } from "@/src/types/project-member";

export function AssigneeFilter({
  column,
  members,
}: {
  column: any;
  members: ProjectMember[];
}) {
  const selectedIds = new Set(column.getFilterValue() as string[]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors group">
          <div className="flex items-center gap-2">
            <UsersRound className="size-4" />
            <p className="text-xs font-medium">Assignees</p>
          </div>
          {selectedIds.size > 0 ? (
            <Funnel className="size-4 fill-blue-500 text-blue-500" />
          ) : (
            <FunnelPlus className="size-4 " />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="center">
        <Command>
          <CommandInput placeholder="Search members..." />
          <CommandList>
            <CommandEmpty>No member found.</CommandEmpty>
            <CommandGroup>
              {members.map((member) => {
                const isSelected = selectedIds.has(member.userId);
                return (
                  <CommandItem
                    key={member.id}
                    onSelect={() => {
                      if (isSelected) {
                        selectedIds.delete(member.userId);
                      } else {
                        selectedIds.add(member.userId);
                      }
                      const filterValues = Array.from(selectedIds);
                      column.setFilterValue(
                        filterValues.length ? filterValues : undefined,
                      );
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`shrink-none flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${isSelected ? "bg-primary text-white" : "opacity-50"}`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member.avatarUrl} />
                        <AvatarFallback>
                          {member.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs truncate">{member.email}</span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
