"use client";
import { cn } from "@/src/lib/utils";
import { Check, Edit2 } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/avatar";
import { Button } from "../shadcn/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../shadcn/command";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";

interface InlineEditDescriptionProps {
  currentAssignees?: User[];
  onSave?: (value: string) => Promise<void>;
  canEdit?: boolean;
  disabled?: boolean;
  className?: string;
}
export const InlineEditAssignees = ({
  currentAssignees,
  onSave,
  canEdit = true,
  disabled = false,
  className = "",
}: InlineEditDescriptionProps) => {
  const [value, setValue] = useState<User[] | undefined>(currentAssignees);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState(false);
  const handleEdit = () => {
    if (!canEdit || disabled) return;
    setIsEditing(true);
    setError("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValue(currentAssignees || undefined);
    setError("");
  };

  const handleSave = () => {
    console.log("Save");
  };
  return (
    <div className={cn("group", className)}>
      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground">Assignees</p>

        <div className="flex items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center p-2 gap-2 bg-muted-foreground/20 rounded-full">
              <Avatar>
                <AvatarImage
                  src="https://github.com"
                  alt="@shadcn"
                  className="grayscale"
                />
                <AvatarFallback className="text-black dark:text-white">
                  D
                </AvatarFallback>
              </Avatar>
              <p className="flex-1 truncate text-xs">
                dangngocson29062003@gmail.com
              </p>
            </div>
          </div>
          {canEdit && (
            <Popover open={open} onOpenChange={setOpen} modal={true}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleEdit}
                  className="h-8 w-8 p-0 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-full p-0 shadow-2xl border-muted/40"
                align="start"
                sideOffset={10}
              >
                <Command className="rounded-lg p-4">
                  <CommandInput
                    placeholder="Search..."
                    className="border-none focus:ring-0 h-11"
                  />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Assigned" className="px-2">
                      <div className="grid grid-cols-3 gap-4">
                        <CommandItem
                          onSelect={() => console.log("Save")}
                          className="flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer aria-selected:bg-accent"
                        >
                          <Avatar>
                            <AvatarImage
                              src="https://github.com/shadcn.png"
                              alt="@shadcn"
                            />
                            <AvatarFallback className="text-black dark:text-white">
                              {"lengocchauaanh2003@gmail.com"
                                .charAt(0)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col flex-1">
                            <p className="text-sm font-medium leading-none">
                              Le Ngoc Chau Anh
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-1">
                              lengocchauaanh2003@gmail.com
                            </p>
                          </div>
                        </CommandItem>
                        <CommandItem
                          onSelect={() => console.log("Save")}
                          className="flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer aria-selected:bg-accent"
                        >
                          <Avatar>
                            <AvatarImage
                              src="https://github.com/shadcn.png"
                              alt="@shadcn"
                            />
                            <AvatarFallback className="text-black dark:text-white">
                              {"dangngocson29062003@gmail.com"
                                .charAt(0)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col flex-1">
                            <p className="text-sm font-medium leading-none">
                              Dang Ngoc Son
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-1">
                              dangngocson29062003@gmail.com
                            </p>
                          </div>
                        </CommandItem>
                        <CommandItem
                          onSelect={() => console.log("Save")}
                          className="flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer aria-selected:bg-accent"
                        >
                          <Avatar>
                            <AvatarImage
                              src="https://github.com"
                              alt="@shadcn"
                            />
                            <AvatarFallback className="text-black dark:text-white">
                              {"thanhcong10@gmail.com".charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col flex-1">
                            <p className="text-sm font-medium leading-none">
                              Do Thanh Cong
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-1">
                              thanhcong10@gmail.com
                            </p>
                          </div>
                        </CommandItem>
                      </div>
                    </CommandGroup>
                    <CommandGroup heading="Unassigned" className="px-2">
                      <div className="grid grid-cols-3 gap-2">
                        <CommandItem
                          onSelect={() => console.log("Save")}
                          className="flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer aria-selected:bg-accent"
                        >
                          <Avatar>
                            <AvatarImage
                              src="https://github.com"
                              alt="@shadcn"
                            />
                            <AvatarFallback className="text-black dark:text-white">
                              {"minhkhang@gmail.com".charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col flex-1">
                            <p className="text-sm font-medium leading-none">
                              Nguyen Minh Khang
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-1">
                              minhkhang@gmail.com
                            </p>
                          </div>
                        </CommandItem>
                        <CommandItem
                          onSelect={() => console.log("Save")}
                          className="flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer aria-selected:bg-accent"
                        >
                          <Avatar>
                            <AvatarImage
                              src="https://github.com/shadcn.png"
                              alt="@shadcn"
                            />
                            <AvatarFallback className="text-black dark:text-white">
                              {"tiendat@gmail.com".charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col flex-1">
                            <p className="text-sm font-medium leading-none">
                              Phung Van Tien Dat
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-1">
                              tiendat@gmail.com
                            </p>
                          </div>
                        </CommandItem>
                      </div>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};
