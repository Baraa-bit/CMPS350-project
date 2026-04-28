import { NextResponse } from "next/server";
import { toggleLike } from "@/repos/post";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const result = await toggleLike(id, userId);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}
