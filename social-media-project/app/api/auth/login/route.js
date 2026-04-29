import { NextResponse } from "next/server";
import { getUserByCredentials } from "@/repos/user";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await getUserByCredentials(email, password);

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
