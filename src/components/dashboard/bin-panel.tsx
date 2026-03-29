"use client";
import { useAuthContext } from "@/src/context/authContext";
import { Project } from "@/src/types/project";
import { useCallback, useEffect, useState } from "react";
import { Input } from "../shadcn/input";
import { ArrowRight, Clock3, Trash, Undo2 } from "lucide-react";
import { Button } from "../shadcn/button";
import { format, formatDistanceToNow } from "date-fns";
import { Tooltip, TooltipContent, TooltipTrigger } from "../shadcn/tooltip";
import { deleteProject, restore } from "@/src/lib/api-project";
import { useProjects } from "@/src/context/homeContext";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../shadcn/dialog";

export function BinPanel() {
  const { authToken } = useAuthContext();
  const { refresh } = useProjects();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const fetchProjects = useCallback(async () => {
    if (!authToken) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/projects/bin`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!res.ok) throw new Error("Failed");

      const result = await res.json();
      setProjects(result.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  const handleRestore = async (projectId: string) => {
    const success = await restore(projectId);
    if (success) {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      await refresh();
    }
  };
  const handleDelete = async (projectId: string) => {
    const success = await deleteProject(projectId);
    if (success) {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      await refresh();
    }
  };
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-black/5">
        <Input
          placeholder="Search in trash..."
          className="text-xs lg:text-sm h-8     focus-visible:ring-0
    focus-visible:border-blue-500
    focus-visible:border-2"
        />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="mb-3 flex items-center justify-center size-12 rounded-full bg-muted">
              <Trash className="size-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Trash is empty</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">
              Deleted items will appear here.
            </p>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="group block w-full rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex flex-col gap-2">
                <div className="flex flex-1  items-center gap-2">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-md border border-border bg-background text-xl font-bold shadow-sm transition-colors group-hover:bg-muted-foreground/10">
                    {project.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary">
                      {project.name}
                    </h3>
                  </div>
                </div>
                <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                  {project.description ||
                    "No description provided for this project."}
                </p>

                <div className="flex min-h-[30px] items-center justify-between gap-2 text-xs">
                  <div className="flex min-w-0 items-center gap-1 text-muted-foreground">
                    <Clock3 className="mt-0.5 size-3.5 shrink-0" />
                    <div className="flex flex-col">
                      <span className="truncate text-xs">
                        {formatDistanceToNow(new Date(project.deletedAt), {
                          addSuffix: true,
                        })}
                      </span>
                      <span className="text-[10px] text-muted-foreground/70 truncate">
                        {format(
                          new Date(project.deletedAt),
                          "HH:mm dd/MM/yyyy",
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 flex gap-4 translate-x-1 items-center text-primary lg:opacity-0 lg:transition-all lg:duration-200 lg:group-hover:translate-x-0 lg:group-hover:opacity-100">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={"ghost"}
                          size={"icon-xs"}
                          className="cursor-pointer"
                          onClick={() => handleRestore(project.id)}
                        >
                          <Undo2 className="size-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Restore</p>
                      </TooltipContent>
                    </Tooltip>
                    <Dialog
                      open={selectedId === project.id}
                      onOpenChange={(isOpen) => {
                        if (!isOpen) setSelectedId(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={"ghost"}
                              size={"icon-xs"}
                              onClick={() => setSelectedId(project.id)}
                            >
                              <Trash className="size-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete from Bin</p>
                          </TooltipContent>
                        </Tooltip>
                      </DialogTrigger>

                      <DialogContent className="max-w-sm rounded-2xl p-6">
                        <div className="flex flex-col items-center text-center gap-4">
                          <div className="flex items-center justify-center size-12 rounded-full bg-red-500/10">
                            <Trash className="size-5 text-red-500" />
                          </div>

                          <div className="space-y-1">
                            <h2 className="text-lg font-semibold">
                              Permanently delete project?
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              This action cannot be undone. The project will be
                              permanently removed from your workspace.
                            </p>
                          </div>

                          <div className="flex w-full gap-2 pt-2">
                            <DialogClose asChild>
                              <Button variant="outline" className="flex-1">
                                Cancel
                              </Button>
                            </DialogClose>

                            <Button
                              variant="destructive"
                              className="flex-1"
                              onClick={async () => {
                                await handleDelete(project.id);
                                setSelectedId(null);
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="px-3 py-2 text-xs text-muted-foreground border-t border-black/5">
        Items in trash will be deleted after 7 days
      </div>
    </div>
  );
}
