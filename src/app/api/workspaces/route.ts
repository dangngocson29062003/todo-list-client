// app/api/workspaces/route.ts

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:8080/api/v1";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get("keyword") ?? "";
    const page = searchParams.get("page") ?? "0";
    const size = searchParams.get("size") ?? "10";
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const response = await fetch(
      `${API_BASE_URL}/workspaces?keyword=${keyword}&page=${page}&size=${size}`,
      {
        headers: {
          Authorization: authHeader,
        },
        cache: "no-store",
      },
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: "Failed to update profile",
      }));
      return NextResponse.json(
        {
          error: errorData.message || "Failed to update profile",
        },
        {
          status: response.status,
        },
      );
    }
    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const res = await fetch(`${API_BASE_URL}/workspaces`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data, {
      status: res.status,
    });
  } catch {
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
