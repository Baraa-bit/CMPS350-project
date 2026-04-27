import * as prisma from "@/repos/prisma";

//Get user by email and password
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

export async function createUser(data) {
  return prisma.user.create({ data });
}

export async function updateUser(id, data) {
  return prisma.user.update({ where: { id }, data });
}
