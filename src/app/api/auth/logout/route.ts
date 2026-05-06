import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:8080/api/v1";
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refresh_token=${refreshToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Logout failed" }));

      return NextResponse.json(
        { error: errorData.message || "Failed to logout" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: data.status });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
