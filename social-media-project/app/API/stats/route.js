import { NextResponse } from "next/server";
import {
  getAverageFollowersPerUser,
  getAveragePostsPerUser,
  getMostActiveUser,
  getMostLikedPost,
  getMostCommentedPost,
  getTopFrequentWords,
  getTotalCounts,
  getUsersWithMostFollowers,
} from "@/repos/stats";

export async function GET() {
  try {
    const [
      avgFollowers,
      avgPosts,
      mostActiveUser,
      mostLikedPost,
      mostCommentedPost,
      topWords,
      totals,
      topFollowed,
    ] = await Promise.all([
      getAverageFollowersPerUser(),
      getAveragePostsPerUser(),
      getMostActiveUser(),
      getMostLikedPost(),
      getMostCommentedPost(),
      getTopFrequentWords(),
      getTotalCounts(),
      getUsersWithMostFollowers(),
    ]);

    return NextResponse.json({
      avgFollowers,
      avgPosts,
      mostActiveUser,
      mostLikedPost,
      mostCommentedPost,
      topWords,
      totals,
      topFollowed,
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
