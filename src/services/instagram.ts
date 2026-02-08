const GRAPH_API = "https://graph.facebook.com/v21.0";

export async function postToInstagram(
  igUserId: string,
  accessToken: string,
  imageUrl: string,
  caption?: string
): Promise<{ postUrl: string }> {
  // Step 1: Create a media container
  const containerParams = new URLSearchParams({
    image_url: imageUrl,
    access_token: accessToken,
  });
  if (caption) {
    containerParams.set("caption", caption);
  }

  const containerRes = await fetch(
    `${GRAPH_API}/${igUserId}/media?${containerParams.toString()}`,
    { method: "POST" }
  );

  if (!containerRes.ok) {
    const text = await containerRes.text();
    throw new Error(
      `Instagram media container creation failed (${containerRes.status}): ${text}`
    );
  }

  const containerData = await containerRes.json();
  const creationId = containerData.id;

  // Step 2: Wait for the container to be ready (poll status)
  let ready = false;
  let attempts = 0;
  while (!ready && attempts < 30) {
    const statusRes = await fetch(
      `${GRAPH_API}/${creationId}?fields=status_code&access_token=${accessToken}`
    );
    const statusData = await statusRes.json();

    if (statusData.status_code === "FINISHED") {
      ready = true;
    } else if (statusData.status_code === "ERROR") {
      throw new Error("Instagram media processing failed");
    } else {
      // Wait 2 seconds before polling again
      await new Promise((resolve) => setTimeout(resolve, 2000));
      attempts++;
    }
  }

  if (!ready) {
    throw new Error("Instagram media processing timed out");
  }

  // Step 3: Publish the container
  const publishRes = await fetch(
    `${GRAPH_API}/${igUserId}/media_publish?creation_id=${creationId}&access_token=${accessToken}`,
    { method: "POST" }
  );

  if (!publishRes.ok) {
    const text = await publishRes.text();
    throw new Error(
      `Instagram publish failed (${publishRes.status}): ${text}`
    );
  }

  const publishData = await publishRes.json();
  const mediaId = publishData.id;

  // Step 4: Get the permalink
  const permalinkRes = await fetch(
    `${GRAPH_API}/${mediaId}?fields=permalink&access_token=${accessToken}`
  );

  if (permalinkRes.ok) {
    const permalinkData = await permalinkRes.json();
    if (permalinkData.permalink) {
      return { postUrl: permalinkData.permalink };
    }
  }

  // Fallback URL if permalink fetch fails
  return { postUrl: `https://www.instagram.com/` };
}
