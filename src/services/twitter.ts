import { readFile } from "fs/promises";
import path from "path";

const UPLOAD_URL = "https://api.x.com/2/media/upload";
const TWEETS_URL = "https://api.x.com/2/tweets";

async function uploadMedia(
  imageUrl: string,
  accessToken: string
): Promise<string> {
  let imageBuffer: Buffer;

  if (imageUrl.startsWith("/")) {
    const filepath = path.join(process.cwd(), "public", imageUrl);
    imageBuffer = await readFile(filepath);
  } else {
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      throw new Error("Failed to fetch image for upload");
    }
    imageBuffer = Buffer.from(await imageRes.arrayBuffer());
  }

  const formData = new FormData();
  const blob = new Blob([imageBuffer], { type: "image/jpeg" });
  formData.append("media", blob, "image.jpg");
  formData.append("media_category", "tweet_image");

  const uploadRes = await fetch(UPLOAD_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!uploadRes.ok) {
    const text = await uploadRes.text();
    throw new Error(`Media upload failed (${uploadRes.status}): ${text}`);
  }

  const data = await uploadRes.json();
  return data.data.id;
}

export async function postTweet(
  text: string,
  accessToken: string,
  imageUrl?: string
): Promise<{ tweetUrl: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: any = { text };

  if (imageUrl) {
    const mediaId = await uploadMedia(imageUrl, accessToken);
    body.media = { media_ids: [mediaId] };
  }

  const res = await fetch(TWEETS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const respText = await res.text();
    throw new Error(`Tweet post failed (${res.status}): ${respText}`);
  }

  const data = await res.json();
  const tweetId = data.data.id;
  return { tweetUrl: `https://x.com/i/status/${tweetId}` };
}
