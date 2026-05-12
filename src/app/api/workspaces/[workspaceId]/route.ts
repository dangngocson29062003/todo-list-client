// app/api/workspaces/[workspaceId]/route.ts

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Params = {
  params: Promise<{
    workspaceId: string;
  }>;
};

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const token = (await cookies()).get("token")?.value;

    const { workspaceId } = await params;

    const body = await req.json();

    const res = await fetch(`${API_URL}/workspaces/${workspaceId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const token = (await cookies()).get("token")?.value;

    const { workspaceId } = await params;

    const res = await fetch(`${API_URL}/workspaces/${workspaceId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
