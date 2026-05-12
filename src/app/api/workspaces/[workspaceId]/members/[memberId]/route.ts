import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Params = {
  params: Promise<{
    workspaceId: string;
    memberId: string;
  }>;
};

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const token = (await cookies()).get("token")?.value;

    const { workspaceId, memberId } = await params;

    const res = await fetch(
      `${API_URL}/workspaces/${workspaceId}/members/${memberId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

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
