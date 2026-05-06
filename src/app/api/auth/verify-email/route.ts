import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:8080/api/v1";
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    console.log("123");
    const response = await fetch(
      `${API_BASE_URL}/auth/verify-email?token=${token}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Verify email failed" }));

      return NextResponse.json(
        { error: errorData.message || "Failed to verify email" },
        { status: response.status },
      );
    }
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
