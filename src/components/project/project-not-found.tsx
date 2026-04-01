import { Button } from "../shadcn/button";
import Link from "next/link";
import { SearchX, Undo2 } from "lucide-react";

export function ProjectNotFound() {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center gap-4 text-center p-4">
      <div className="rounded-full bg-muted p-4">
        <SearchX className="text-muted-foreground size-8" />
      </div>
      <h2 className="text-xl font-bold tracking-tight">Project not found</h2>
      <p className="text-sm text-muted-foreground">
        The project you're looking for doesn't exist or you don't have
        permission to view it.
      </p>
      <Button variant={"ghost"} asChild className="mt-2 text-muted-foreground ">
        <Link href="/project">
          <Undo2 className=" size-4" />
          Back to projects
        </Link>
      </Button>
    </div>
  );
}
