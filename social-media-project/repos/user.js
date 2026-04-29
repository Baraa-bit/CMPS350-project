import prisma from "@/repos/prisma";

export async function getUserByCredentials(email, password) {
  return prisma.user.findFirst({
    where: { email, password },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      profilePicture: true,
    },
  });
}

export async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      profilePicture: true,
      gender: true,
      birthdate: true,
      _count: { select: { followers: true, following: true, posts: true } },
    },
  });
}

export async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
      bio: true,
    },
  });
}

export async function createUser(data) {
  return prisma.user.create({ data });
}

export async function updateUser(id, data) {
  return prisma.user.update({ where: { id }, data });
}

export async function followUser(followerId, followingId) {
  return prisma.follow.create({ data: { followerId, followingId } });
}

export async function unfollowUser(followerId, followingId) {
  return prisma.follow.deleteMany({ where: { followerId, followingId } });
}

export async function isFollowing(followerId, followingId) {
  const result = await prisma.follow.findFirst({
    where: { followerId, followingId },
  });
  return !!result;
}

export async function getFollowers(userId) {
  return prisma.follow.findMany({
    where: { followingId: userId },
    select: {
      follower: {
        select: { id: true, name: true, profilePicture: true },
      },
    },
  });
}

export async function getFollowing(userId) {
  return prisma.follow.findMany({
    where: { followerId: userId },
    select: {
      following: {
        select: { id: true, name: true, profilePicture: true },
      },
    },
  });
}
