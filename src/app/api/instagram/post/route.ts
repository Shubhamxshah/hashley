import { getValidAccessToken } from "@/lib/instagram-auth";
import { postToInstagram } from "@/services/instagram";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { caption, imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required for Instagram posts" },
        { status: 400 }
      );
    }

    const { token, session } = await getValidAccessToken(request);
    const result = await postToInstagram(
      session.user.igUserId,
      token,
      imageUrl,
      caption
    );

    return NextResponse.json({
      success: true,
      postUrl: result.postUrl,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to post to Instagram";
    const status = message === "Not authenticated" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
