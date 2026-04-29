import { NextResponse } from "next/server";
import { getPostById, deletePost } from "@/repos/post";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get("currentUserId");

    const post = await getPostById(id, currentUserId);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { authorId } = await request.json();

    if (!authorId) {
      return NextResponse.json({ error: "authorId is required" }, { status: 400 });
    }

    const result = await deletePost(id, authorId);

    if (result.count === 0) {
      return NextResponse.json({ error: "Post not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Post deleted" });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
