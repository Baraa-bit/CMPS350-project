import { NextResponse } from "next/server";
import { deleteComment } from "@/repos/post";

export async function DELETE(request, { params }) {
  try {
    const { commentId } = await params;
    const { authorId } = await request.json();

    if (!authorId) {
      return NextResponse.json({ error: "authorId is required" }, { status: 400 });
    }

    const commentIdNum = parseInt(commentId, 10);

    const result = await deleteComment(commentIdNum, authorId);

    if (result.count === 0) {
      return NextResponse.json({ error: "Comment not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Comment deleted" });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
