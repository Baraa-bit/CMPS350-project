import prisma from "@/repos/prisma";

export async function getAverageFollowersPerUser() {
  const result = await prisma.user.findMany({
    select: {
      _count: { select: { followers: true } },
    },
  });
  const total = result.reduce((sum, u) => sum + u._count.followers, 0);
  return result.length > 0 ? (total / result.length).toFixed(2) : 0;
}

export async function getAveragePostsPerUser() {
  const result = await prisma.user.findMany({
    select: {
      _count: { select: { posts: true } },
    },
  });
  const total = result.reduce((sum, u) => sum + u._count.posts, 0);
  return result.length > 0 ? (total / result.length).toFixed(2) : 0;
}

export async function getMostActiveUser() {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      profilePicture: true,
      posts: {
        where: { timestamp: { gte: threeMonthsAgo } },
        select: { id: true },
      },
      comments: {
        where: { timestamp: { gte: threeMonthsAgo } },
        select: { id: true },
      },
      likes: { select: { id: true } },
    },
  });

  let topUser = null;
  let maxActivity = 0;

  for (const user of users) {
    const activity = user.posts.length + user.comments.length + user.likes.length;
    if (activity > maxActivity) {
      maxActivity = activity;
      topUser = { id: user.id, name: user.name, profilePicture: user.profilePicture, activity };
    }
  }

  return topUser;
}

export async function getMostLikedPost() {
  const post = await prisma.post.findFirst({
    orderBy: { likes: { _count: "desc" } },
    include: {
      author: { select: { id: true, name: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });
  return post;
}

export async function getMostCommentedPost() {
  const post = await prisma.post.findFirst({
    orderBy: { comments: { _count: "desc" } },
    include: {
      author: { select: { id: true, name: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });
  return post;
}

export async function getTopFrequentWords() {
  const posts = await prisma.post.findMany({
    select: { content: true },
  });

  const stopWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "in", "on", "at",
    "to", "for", "of", "and", "or", "it", "i", "me", "my", "you",
    "your", "he", "she", "they", "we", "this", "that", "with", "from",
    "by", "so", "but", "not", "just", "about", "up", "out", "if",
    "do", "no", "be", "am", "has", "have", "had", "its", "too",
  ]);

  const wordCount = {};
  for (const post of posts) {
    const words = post.content.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/);
    for (const word of words) {
      if (word.length > 1 && !stopWords.has(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    }
  }

  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));
}

export async function getTotalCounts() {
  const [users, posts, comments, likes, follows] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.comment.count(),
    prisma.like.count(),
    prisma.follow.count(),
  ]);
  return { users, posts, comments, likes, follows };
}

export async function getUsersWithMostFollowers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      profilePicture: true,
      _count: { select: { followers: true } },
    },
    orderBy: { followers: { _count: "desc" } },
    take: 5,
  });
  return users;
}
