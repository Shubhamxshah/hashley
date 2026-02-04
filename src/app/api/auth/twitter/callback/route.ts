import {
  exchangeCodeForTokens,
  decryptState,
  encryptSession,
  type TwitterSession,
} from "@/lib/twitter-auth";
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

  // Decrypt code_verifier from the state parameter
  const stateData = await decryptState(state);
  if (!stateData) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/social?error=invalid_state`
    );
  }

  try {
    const tokens = await exchangeCodeForTokens(code, stateData.codeVerifier);

    // Fetch user profile
    const userRes = await fetch(
      "https://api.x.com/2/users/me?user.fields=profile_image_url",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );

    if (!userRes.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const userData = await userRes.json();
    const user = userData.data;

    const session: TwitterSession = {
      tokens,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        profile_image_url: user.profile_image_url,
      },
    };

    const encrypted = await encryptSession(session);
    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/social`
    );

    response.cookies.set("twitter_session", encrypted, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
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
