import * as prisma from "@/repos/prisma";
import { nanoid } from "nanoid";

export async function getFeedPosts(userId) {
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const followingIds = following.map((f) => f.followingId);

  return prisma.post.findMany({
    where: { authorId: { in: [...followingIds, userId] } },
    orderBy: { createdAt: "desc" },
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
    orderBy: { createdAt: "desc" },
    include: {
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
        orderBy: { createdAt: "asc" },
      },
      likes: { where: { userId: currentUserId }, select: { id: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });
}

export async function createPost(authorId, content) {
  const id = "p_" + nanoid(4);
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

// this method for liking and unliking posts
export async function toggleLike(postId, userId) {
  const existing = await prisma.like.findUnique({
    where: { postId_userId: { postId, userId } },
  });
  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return { liked: false };
  } else {
    await prisma.like.create({ data: { postId, userId } });
    return { liked: true };
  }
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
  return prisma.comment.delete({ where: { id: commentId, authorId } });
}
