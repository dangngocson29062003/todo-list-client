import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:8080/api/v1";
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const body = await request.json();
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Register failed" }));

      return NextResponse.json(
        { error: errorData.message || "Failed to register" },
        { status: response.status },
      );
    }
    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
