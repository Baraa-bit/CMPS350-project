import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "./client/client.js";
import "dotenv/config";

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({
    url: process.env.DATABASE_URL ?? "",
  }),
});

try {
  //Check if db already has data
  const userCount = await prisma.user.count();

  // if the db have data there will be no seeding
  if (userCount > 0) {
    console.log("Database already seeded");
  } else {
    const users = await Bun.file("./json/user.json").json();
    const posts = await Bun.file("./json/post.json").json();

    //users
    for (const user of users) {
      await prisma.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          profilePicture: user.profilePicture,
          birthdate: user.birthdate ? new Date(user.birthdate) : null,
          gender: user.gender,
          bio: user.bio,
        },
      });
    }

    // follows
    for (const user of users) {
      for (const followingId of user.following || []) {
        await prisma.follow.create({
          data: {
            followerId: user.id,
            followingId,
          },
        });
      }
    }

    // posts
    for (const post of posts) {
      await prisma.post.create({
        data: {
          id: post.postId,
          content: post.content,
          timestamp: new Date(post.timestamp),
          authorId: post.authorId,
        },
      });
    }

    // comments
    for (const post of posts) {
      for (const comment of post.comments || []) {
        await prisma.comment.create({
          data: {
            content: comment.content,
            timestamp: new Date(comment.timestamp),
            postId: post.postId,
            authorId: comment.authorId,
          },
        });
      }
    }

    //Likes
    for (const post of posts) {
      for (const userId of post.likedBy || []) {
        await prisma.like.create({
          data: {
            postId: post.postId,
            userId,
          },
        });
      }
    }
  }
} catch (e) {
  console.error(e);
} finally {
  await prisma.$disconnect();
}
