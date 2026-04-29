import { NextResponse } from "next/server";
import { getUserById, updateUser } from "@/repos/user";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const allowed = {};
    if (data.name !== undefined) allowed.name = data.name;
    if (data.bio !== undefined) allowed.bio = data.bio;
    if (data.profilePicture !== undefined) allowed.profilePicture = data.profilePicture;
    if (data.gender !== undefined) allowed.gender = data.gender;
    if (data.birthdate !== undefined) allowed.birthdate = data.birthdate ? new Date(data.birthdate) : null;

    const user = await updateUser(id, allowed);
    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
