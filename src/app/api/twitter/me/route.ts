import { getSessionFromCookies } from "@/lib/twitter-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSessionFromCookies();

  if (!session) {
    return NextResponse.json({ connected: false }, { status: 200 });
  }

  return NextResponse.json({
    connected: true,
    user: session.user,
  });
}
