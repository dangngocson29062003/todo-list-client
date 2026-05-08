import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:8080/api/v1";
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const response = await fetch(
      `${API_BASE_URL}/auth/forgot-password?email=${email}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Forgot password failed" }));

      return NextResponse.json(
        { error: errorData.message || "Failed to forgot password" },
        { status: response.status },
      );
    }
    const data = await response.json();
    return NextResponse.json(data, { status: data.status });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
