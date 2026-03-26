import { KeyboardEvent, useState, useRef } from "react";
import { X } from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../shadcn/command";
import { TechBadge } from "../tech-bage";
import { TechStack } from "@/src/types/enum";
import { cn } from "@/src/lib/utils";

export function FancyTechInput({
  selected,
  onAdd,
  onRemove,
}: {
  selected: string[];
  onAdd: (tech: string) => void;
  onRemove: (tech: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  const allTechEnums = Object.values(TechStack);
  const selectables = allTechEnums.filter((t) => !selected.includes(t));
  const filtered = selectables.filter((t) =>
    t.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "" && selected.length > 0) {
          onRemove(selected[selected.length - 1]);
        }
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const trimmed = inputValue.trim();
        if (trimmed) {
          const matched = allTechEnums.find(
            (t) => t.toLowerCase() === trimmed.toLowerCase(),
          );
          onAdd(matched || trimmed);
          setInputValue("");
        }
      }
      if (e.key === "Escape") {
        input.blur();
      }
    }
  };

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="relative">
        {open && (filtered.length > 0 || inputValue.length > 0) && (
          <div className="absolute bottom-0 mb-2 left-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in slide-in-from-top-2">
            <CommandList className="max-h-[450px] overflow-auto p-1 custom-scrollbar">
              <CommandGroup heading="Suggestions">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-1">
                  {inputValue &&
                    !allTechEnums.some(
                      (t) => t.toLowerCase() === inputValue.toLowerCase(),
                    ) && (
                      <CommandItem
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onSelect={() => {
                          onAdd(inputValue);
                          setInputValue("");
                        }}
                        className="cursor-pointer p-0 border rounded-md overflow-hidden"
                      >
                        <div className="p-2 flex justify-center items-center">
                          Add custom: "{inputValue}"
                        </div>
                      </CommandItem>
                    )}
                  {filtered.map((tech) => (
                    <CommandItem
                      key={tech}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        onAdd(tech);
                        setInputValue("");
                      }}
                      className="cursor-pointer p-0 border rounded-md overflow-hidden"
                    >
                      <div className="p-2 w-full flex justify-between items-center">
                        <TechBadge tech={tech as TechStack} />
                      </div>
                    </CommandItem>
                  ))}
                </div>
              </CommandGroup>
            </CommandList>
          </div>
        )}
      </div>
      <div className="group rounded-md border border-input px-2 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 bg-transparent dark:bg-input/30">
        <div className="flex flex-wrap gap-1">
          {selected.map((tech) => (
            <div
              key={tech}
              className="flex items-center animate-in fade-in zoom-in-95 duration-200"
            >
              <TechBadge tech={tech as TechStack} className="pr-1" />
              <button
                type="button"
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-muted p-0.5"
                onClick={() => onRemove(tech)}
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
          ))}
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={
              selected.length === 0
                ? "What's in your stack? Find a tech or type your own"
                : ""
            }
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1 min-w-[120px]"
          />
        </div>
      </div>
    </Command>
  );
}
