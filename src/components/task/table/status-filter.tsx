import {
  Calendar,
  ChartBarBig,
  Check,
  CircleAlert,
  Funnel,
  FunnelPlus,
} from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../../shadcn/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../shadcn/popover";
import { Priority, TaskStatus } from "@/src/types/enum";
import { StatusIndicator } from "../../status-badge";

const priorityLabels: Record<Priority, string> = {
  [Priority.URGENT]: "Urgent",
  [Priority.HIGH]: "High",
  [Priority.MEDIUM]: "Medium",
  [Priority.LOW]: "Low",
};

export function StatusFilter({ column }: { column: any }) {
  const selectedValues = new Set(column.getFilterValue() as string[]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors group cursor-pointer">
          <div className="flex items-center gap-2">
            <ChartBarBig className="size-4" />
            <p className="text-xs font-medium">Status</p>
          </div>
          {selectedValues.size > 0 ? (
            <Funnel className="size-4 fill-blue-500 text-blue-500" />
          ) : (
            <FunnelPlus className="size-4" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandList>
            <CommandGroup>
              {Object.values(TaskStatus).map((statusValue) => {
                const isSelected = selectedValues.has(statusValue);

                return (
                  <CommandItem
                    key={statusValue}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(statusValue);
                      } else {
                        selectedValues.add(statusValue);
                      }
                      const filterValues = Array.from(selectedValues);
                      column.setFilterValue(
                        filterValues.length ? filterValues : undefined,
                      );
                    }}
                  >
                    <div
                      className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50"
                      }`}
                    >
                      {isSelected && <Check className="h-4 w-4" />}
                    </div>
                    <StatusIndicator status={statusValue} />
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
