import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  // Delete auth cookies
  cookieStore.delete("access");
  cookieStore.delete("refresh");

  // Redirect to login
  return NextResponse.redirect("/login");
}
