import prisma from "@/repos/prisma";

export async function getFeedPosts(userId) {
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const followingIds = following.map((f) => f.followingId);

  return prisma.post.findMany({
    where: { authorId: { in: [...followingIds, userId] } },
    orderBy: { timestamp: "desc" },
    include: {
      author: { select: { id: true, name: true, profilePicture: true } },
      _count: { select: { likes: true, comments: true } },
      likes: { where: { userId }, select: { id: true } },
    },
  });
}

export async function getUserPosts(userId) {
  return prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { timestamp: "desc" },
    include: {
      author: { select: { id: true, name: true, profilePicture: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });
}

export async function getPostById(postId, currentUserId) {
  return prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: { select: { id: true, name: true, profilePicture: true } },
      comments: {
        include: {
          author: { select: { id: true, name: true, profilePicture: true } },
        },
        orderBy: { timestamp: "asc" },
      },
      likes: currentUserId
        ? { where: { userId: currentUserId }, select: { id: true } }
        : false,
      _count: { select: { likes: true, comments: true } },
    },
  });
}

export async function getAllPosts() {
  return prisma.post.findMany({
    orderBy: { timestamp: "desc" },
    include: {
      author: { select: { id: true, name: true, profilePicture: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });
}

export async function createPost(authorId, content) {
  const id = "p_" + Math.random().toString(36).substring(2, 6);
  return prisma.post.create({
    data: { id, content, authorId },
    include: {
      author: { select: { id: true, name: true, profilePicture: true } },
    },
  });
}

export async function deletePost(postId, authorId) {
  return prisma.post.deleteMany({ where: { id: postId, authorId } });
}

export async function toggleLike(postId, userId) {
  const existing = await prisma.like.findUnique({
    where: { postId_userId: { postId, userId } },
  });
  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return { liked: false };
  }
  await prisma.like.create({ data: { postId, userId } });
  return { liked: true };
}

export async function addComment(postId, authorId, content) {
  return prisma.comment.create({
    data: { postId, authorId, content },
    include: {
      author: { select: { id: true, name: true, profilePicture: true } },
    },
  });
}

export async function deleteComment(commentId, authorId) {
  return prisma.comment.deleteMany({
    where: { id: commentId, authorId },
  });
}
