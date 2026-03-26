"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input } from "../shadcn/input";
import { Button } from "../shadcn/button";

type GoalInputProps = {
  goals: string[]; // Chỉ là mảng string
  setGoals: (goals: string[]) => void;
};

export function GoalInput({ goals, setGoals }: GoalInputProps) {
  // Thêm một dòng trống mới
  const addGoalRow = () => {
    setGoals([...goals, ""]);
  };

  // Cập nhật text theo index
  const updateGoal = (index: number, newText: string) => {
    const updatedGoals = [...goals];
    updatedGoals[index] = newText;
    setGoals(updatedGoals);
  };

  // Xóa theo index
  const removeGoal = (index: number) => {
    if (goals.length > 1) {
      setGoals(goals.filter((_, i) => i !== index));
    } else {
      setGoals([""]); // Luôn giữ ít nhất 1 dòng trống
    }
  };

  return (
    <div className="rounded-md border border-border bg-transparent dark:bg-input/30 divide-y divide-border overflow-hidden">
      {goals.map((goalText, index) => (
        <div
          key={index}
          className="group flex items-center gap-2 p-1 px-2 hover:bg-muted/30 transition-colors"
        >
          <span className="text-[10px] font-mono text-muted-foreground w-4 text-center">
            {index + 1}
          </span>
          <Input
            value={goalText}
            onChange={(e) => updateGoal(index, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addGoalRow();
              }
              if (
                e.key === "Backspace" &&
                goalText === "" &&
                goals.length > 1
              ) {
                e.preventDefault();
                removeGoal(index);
              }
            }}
            placeholder="Type a goal..."
            className="flex-1 border-none bg-transparent! shadow-none focus-visible:ring-0 h-8 text-sm placeholder:text-muted-foreground/40"
            // Tự động focus vào dòng mới tạo (ngoại trừ dòng đầu tiên lúc khởi tạo)
            autoFocus={index === goals.length - 1 && index !== 0}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeGoal(index)}
            className="opacity-0 group-hover:opacity-100 h-6 w-6 text-muted-foreground hover:text-destructive transition-all p-0"
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="secondary"
        onClick={addGoalRow}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-t-none rounded-b-md! text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border-t border-border h-9"
      >
        <Plus className="size-4" />
        <span>Add new goal</span>
      </Button>
    </div>
  );
}
