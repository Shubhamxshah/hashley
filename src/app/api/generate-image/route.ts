import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

const POLLINATIONS_URL = "https://gen.pollinations.ai/image";

export async function POST(request: NextRequest) {
  try {
    const { prompt, width = 1024, height = 1024 } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const cleaned = prompt.trim().slice(0, 300);
    const encoded = encodeURIComponent(cleaned);
    const url = `${POLLINATIONS_URL}/${encoded}?model=flux&width=${width}&height=${height}&nologo=true`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.POLLINATIONS_API_KEY}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Image generation failed: ${res.status}` },
        { status: 502 }
      );
    }

    const buffer = Buffer.from(await res.arrayBuffer());

    // Save to public/generated with a unique filename
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
    const filepath = path.join(process.cwd(), "public", "generated", filename);
    await writeFile(filepath, buffer);

    const imageUrl = `/generated/${filename}`;

    return NextResponse.json({ imageUrl, prompt: cleaned });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
