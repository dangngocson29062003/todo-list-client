import { NextRequest, NextResponse } from "next/server";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:8080";
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string; taskId: string }> },
) {
  try {
    const { id, taskId } = await context.params;
    const body = await request.json();
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(
      `${API_BASE_URL}/projects/${id}/tasks/${taskId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Update task failed" }));

      return NextResponse.json(
        { error: errorData.message || "Failed to update task" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
