import { NextResponse } from "next/server";
import { getAllPosts, getFeedPosts, getUserPosts, createPost } from "@/repos/post";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const feed = searchParams.get("feed");

    if (feed && userId) {
      const posts = await getFeedPosts(userId);
      return NextResponse.json(posts);
    }

    if (userId) {
      const posts = await getUserPosts(userId);
      return NextResponse.json(posts);
    }

    const posts = await getAllPosts();
    return NextResponse.json(posts);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { authorId, content } = await request.json();

    if (!authorId || !content) {
      return NextResponse.json({ error: "authorId and content are required" }, { status: 400 });
    }

    const post = await createPost(authorId, content);
    return NextResponse.json(post, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
