import { NextResponse } from "next/server";
import { createUser, getUserByCredentials } from "@/repos/user";
import prisma from "@/repos/prisma";
import { nanoid } from "nanoid";

export async function POST(request) {
  try {
    const { name, email, password, birthdate, gender } = await request.json();

    if (!name || !email || !password || !birthdate || !gender) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const user = await createUser({
      id: nanoid(8),
      name,
      email,
      password,
      birthdate: new Date(birthdate),
      gender,
    });

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
