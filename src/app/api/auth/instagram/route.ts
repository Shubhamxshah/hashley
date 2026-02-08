import { encryptState, getAuthorizationUrl } from "@/lib/instagram-auth";
import { NextResponse } from "next/server";

export async function GET() {
  // Generate a random nonce for CSRF protection
  const nonce = crypto.randomUUID();
  const state = await encryptState(nonce);
  const authUrl = getAuthorizationUrl(state);

  return NextResponse.redirect(authUrl);
}
