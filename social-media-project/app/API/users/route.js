import { NextResponse } from "next/server";
import { getAllUsers, createUser } from "@/repos/user";

export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.id || !data.name || !data.email || !data.password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await createUser({
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      profilePicture: data.profilePicture || "../assets/profiles/default-avatar.jpg",
      birthdate: data.birthdate ? new Date(data.birthdate) : null,
      gender: data.gender || null,
      bio: data.bio || null,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (e) {
    if (e.code === "P2002") {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
