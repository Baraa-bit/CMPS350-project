import { NextResponse } from "next/server";
import { addComment } from "@/repos/post";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { authorId, content } = await request.json();

    if (!authorId || !content) {
      return NextResponse.json({ error: "authorId and content are required" }, { status: 400 });
    }

    const comment = await addComment(id, authorId, content);
    return NextResponse.json(comment, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
