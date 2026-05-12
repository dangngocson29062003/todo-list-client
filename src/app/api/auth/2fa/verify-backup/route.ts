import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:8080/api/v1";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const backupCode = searchParams.get("backupCode");
    if (!backupCode) {
      return NextResponse.json(
        { error: "Backup code is required" },
        { status: 400 },
      );
    }
    const userAgent = request.headers.get("user-agent") || "";
    let ipAddress = request.headers.get("x-real-ip") as string;
    const forwardedFor = request.headers.get("x-forwarded-for") as string;
    if (!ipAddress && forwardedFor) {
      ipAddress = forwardedFor?.split(",").at(0) ?? "Unknown";
    }
    const cookieStore = await cookies();
    const mfaToken = cookieStore.get("mfa_token")?.value;
    const deviceId = cookieStore.get("device_id")?.value;
    const response = await fetch(
      `${API_BASE_URL}/auth/2fa/verify-backup?backupCode=${backupCode}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": userAgent,
          "X-Forwarded-For": ipAddress,
          Cookie: `device_id=${deviceId}; mfa_token=${mfaToken}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Enable failed" }));
      return NextResponse.json(
        { error: errorData.message || "Failed to enable" },
        { status: response.status },
      );
    }
    const data = await response.json();
    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      nextResponse.headers.set("set-cookie", setCookie);
    }
    return nextResponse;
  } catch (error) {
    console.error("Enable 2FA error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
