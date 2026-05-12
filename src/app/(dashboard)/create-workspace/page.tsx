"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/src/components/shadcn/button";
import { Input } from "@/src/components/shadcn/input";
import { Textarea } from "@/src/components/shadcn/textarea";
import { useNotifyContext } from "@/src/components/notification/notificationProvider";
import Image from "next/image";
import { useAuthContext } from "@/src/context/authContext";

export default function CreateWorkspacePage() {
  const router = useRouter();
  const notify = useNotifyContext();

  const { authToken, authUser } = useAuthContext();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  async function handleCreateWorkspace() {
    try {
      setLoading(true);

      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name,
          slug,
          description,
          type: "TEAM",
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Create workspace failed");
      }

      notify("success", "Workspace created successfully");

      router.replace(`/workspace/${json.data.slug}`);
    } catch (error) {
      notify(
        "error",
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-8">
            <Image
              src="/images/logo.png"
              alt="logo"
              width={32}
              height={32}
              className="animate-pulse"
            />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">
            Create your workspace
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Set up a shared space for your team, projects, and members.
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Workspace name</label>

            <Input
              placeholder="Acme Team"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {slug && (
              <p className="text-xs text-muted-foreground">
                URL: /workspace/{slug}
              </p>
            )}
          </div>

          <Button
            className="w-full"
            disabled={!name.trim() || loading}
            onClick={handleCreateWorkspace}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating workspace...
              </>
            ) : (
              "Create workspace"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
