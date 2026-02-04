export async function generateImage({
  prompt,
  width = 1024,
  height = 1024,
}: {
  prompt: string;
  width?: number;
  height?: number;
}): Promise<{ imageUrl: string; prompt: string }> {
  const res = await fetch("/api/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, width, height }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Image generation failed");
  }

  return res.json();
}
