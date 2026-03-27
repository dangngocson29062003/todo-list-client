"use server";

import { revalidatePath } from "next/cache";

export async function createProjectAction(payload: any, token: string) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const res = await fetch(`${appUrl}/api/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: result.error || "Failed to create project",
      };
    }
    revalidatePath("/", "layout");

    return { success: true, data: result.data };
  } catch (error) {
    return { success: false, error: "Internal server error" };
  }
}
