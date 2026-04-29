import { NextResponse } from "next/server";
import { getUserByCredentials } from "@/repos/user";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 },
      );
    }

    const user = await getUserByCredentials(email, password);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 },
      );
    }

    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { message: "Login failed. Please try again." },
      { status: 500 },
    );
  }
}
