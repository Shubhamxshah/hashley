import {
  generateCodeVerifier,
  generateCodeChallenge,
  encryptState,
  getAuthorizationUrl,
} from "@/lib/twitter-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Encrypt the code_verifier into the state parameter itself
  const state = await encryptState(codeVerifier);
  const authUrl = getAuthorizationUrl(state, codeChallenge);

  return NextResponse.redirect(authUrl);
}
