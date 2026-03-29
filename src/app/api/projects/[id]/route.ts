import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:8080";
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Get project failed" }));
      return NextResponse.json(
        { error: errorData.message },
        { status: response.status },
      );
    }

    const data = await response.json();
    console.log(data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Get project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Update project failed" }));

      return NextResponse.json(
        { error: errorData.message || "Failed to update project" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
