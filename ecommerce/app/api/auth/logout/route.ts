import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // To log the user out, we simply delete the 'token' cookie.
    cookies().delete("token");

    return NextResponse.json({ message: "Logout successful" }, { status: 200 });
  } catch (error) {
    console.error("Logout API Error:", error);
    return NextResponse.json({ message: "Error during logout" }, { status: 500 });
  }
}