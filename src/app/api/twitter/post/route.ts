import { getValidAccessToken, encryptSession } from "@/lib/twitter-auth";
import { postTweet } from "@/services/twitter";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text, imageUrl } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Tweet text is required" },
        { status: 400 }
      );
    }

    const { token, session, refreshed } = await getValidAccessToken(request);
    const result = await postTweet(text, token, imageUrl);

    const response = NextResponse.json({
      success: true,
      tweetUrl: result.tweetUrl,
    });

    if (refreshed) {
      const encrypted = await encryptSession(session);
      response.cookies.set("twitter_session", encrypted, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
    }

    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to post tweet";
    const status = message === "Not authenticated" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
