import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:8080/api/v1";
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const otp = searchParams.get("otp");
    if (!otp) {
      return NextResponse.json({ error: "OTP is required" }, { status: 400 });
    }
    const cookieStore = await cookies();
    const mfaToken = cookieStore.get("mfa_token")?.value;
    const response = await fetch(`${API_BASE_URL}/auth/2fa?otp=${otp}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `mfa_token=${mfaToken}`,
      },
      credentials: "include",
    });
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
    console.error("2FA verify error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
