import { NextResponse } from "next/server";
import { followUser, unfollowUser, isFollowing, getFollowers, getFollowing } from "@/repos/user";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "following") {
      const following = await getFollowing(id);
      return NextResponse.json(following.map((f) => f.following));
    }

    const followers = await getFollowers(id);
    return NextResponse.json(followers.map((f) => f.follower));
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch follow data" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { followerId } = await request.json();

    if (!followerId) {
      return NextResponse.json({ error: "followerId is required" }, { status: 400 });
    }

    if (followerId === id) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
    }

    const already = await isFollowing(followerId, id);
    if (already) {
      return NextResponse.json({ error: "Already following this user" }, { status: 409 });
    }

    await followUser(followerId, id);
    return NextResponse.json({ message: "Followed successfully" }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to follow user" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { followerId } = await request.json();

    if (!followerId) {
      return NextResponse.json({ error: "followerId is required" }, { status: 400 });
    }

    await unfollowUser(followerId, id);
    return NextResponse.json({ message: "Unfollowed successfully" });
  } catch (e) {
    return NextResponse.json({ error: "Failed to unfollow user" }, { status: 500 });
  }
}
