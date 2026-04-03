import { Calendar, Check, CircleAlert, Funnel, FunnelPlus } from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../../shadcn/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../shadcn/popover";
import { Priority } from "@/src/types/enum";

const priorityLabels: Record<Priority, string> = {
  [Priority.URGENT]: "Urgent",
  [Priority.HIGH]: "High",
  [Priority.MEDIUM]: "Medium",
  [Priority.LOW]: "Low",
};

export function PriorityFilter({ column }: { column: any }) {
  const selectedValues = new Set(column.getFilterValue() as string[]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors group">
          <div className="flex items-center gap-2">
            <CircleAlert className="size-4" />
            <p className="text-xs font-medium">Priority</p>
          </div>
          {selectedValues.size > 0 ? (
            <Funnel className="size-4 fill-blue-500 text-blue-500" />
          ) : (
            <FunnelPlus className="size-4 " />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandList>
            <CommandGroup>
              {Object.values(Priority).map((priorityValue) => {
                const isSelected = selectedValues.has(priorityValue);
                return (
                  <CommandItem
                    key={priorityValue}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(priorityValue);
                      } else {
                        selectedValues.add(priorityValue);
                      }
                      const filterValues = Array.from(selectedValues);
                      column.setFilterValue(
                        filterValues.length ? filterValues : undefined,
                      );
                    }}
                  >
                    <div
                      className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${isSelected ? "bg-primary text-primary-foreground" : "opacity-50"}`}
                    >
                      {isSelected && <Check className="h-4 w-4" />}
                    </div>
                    <span>{priorityLabels[priorityValue]}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column.setFilterValue(undefined)}
                    className="justify-center text-center text-red-500 text-xs"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
