import {
  exchangeCodeForTokens,
  getLongLivedToken,
  getInstagramAccount,
  decryptState,
  encryptSession,
  type InstagramSession,
} from "@/lib/instagram-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/social?error=${encodeURIComponent(error)}`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/social?error=missing_params`
    );
  }

  // Validate state for CSRF protection
  const stateData = await decryptState(state);
  if (!stateData) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/social?error=invalid_state`
    );
  }

  try {
    // Exchange code for short-lived token
    const { short_lived_token } = await exchangeCodeForTokens(code);

    // Exchange for long-lived token (~60 days)
    const tokens = await getLongLivedToken(short_lived_token);

    // Get Instagram Business/Creator account via Facebook Pages
    const igAccount = await getInstagramAccount(tokens.access_token);

    const session: InstagramSession = {
      tokens,
      user: {
        igUserId: igAccount.igUserId,
        username: igAccount.username,
        name: igAccount.name,
        profilePictureUrl: igAccount.profilePictureUrl,
      },
    };

    const encrypted = await encryptSession(session);
    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/social`
    );

    response.cookies.set("instagram_session", encrypted, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 24 * 60 * 60, // 60 days
      path: "/",
    });

    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/social?error=${encodeURIComponent(message)}`
    );
  }
}
