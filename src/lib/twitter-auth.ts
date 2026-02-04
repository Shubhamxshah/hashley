import { EncryptJWT, jwtDecrypt } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const TWITTER_AUTH_URL = "https://x.com/i/oauth2/authorize";
const TWITTER_TOKEN_URL = "https://api.x.com/2/oauth2/token";
const SCOPES = "tweet.read tweet.write users.read offline.access media.write";

const SESSION_COOKIE = "twitter_session";

function getEncryptionKey(): Uint8Array {
  const secret = process.env.TOKEN_ENCRYPTION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("TOKEN_ENCRYPTION_SECRET must be at least 32 characters");
  }
  return new TextEncoder().encode(secret.slice(0, 32));
}

// PKCE helpers
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Encode code_verifier into the state param (encrypted), so no cookie needed
export async function encryptState(codeVerifier: string): Promise<string> {
  const key = getEncryptionKey();
  const jwe = await new EncryptJWT({ cv: codeVerifier })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .encrypt(key);
  return jwe;
}

export async function decryptState(
  state: string
): Promise<{ codeVerifier: string } | null> {
  try {
    const key = getEncryptionKey();
    const { payload } = await jwtDecrypt(state, key);
    return { codeVerifier: payload.cv as string };
  } catch {
    return null;
  }
}

// OAuth URL
export function getAuthorizationUrl(
  state: string,
  codeChallenge: string
): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.TWITTER_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter/callback`,
    scope: SCOPES,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });
  return `${TWITTER_AUTH_URL}?${params.toString()}`;
}

// Token exchange
export interface TwitterTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string
): Promise<TwitterTokens> {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter/callback`,
    code_verifier: codeVerifier,
  });

  const credentials = Buffer.from(
    `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(TWITTER_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${text}`);
  }

  const data = await res.json();
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
  };
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<TwitterTokens> {
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const credentials = Buffer.from(
    `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(TWITTER_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token refresh failed: ${text}`);
  }

  const data = await res.json();
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
  };
}

// Token encryption/decryption with JWE
export interface TwitterSession {
  tokens: TwitterTokens;
  user: {
    id: string;
    name: string;
    username: string;
    profile_image_url?: string;
  };
}

export async function encryptSession(session: TwitterSession): Promise<string> {
  const key = getEncryptionKey();
  return new EncryptJWT({ session: JSON.stringify(session) })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .encrypt(key);
}

export async function decryptSession(
  token: string
): Promise<TwitterSession | null> {
  try {
    const key = getEncryptionKey();
    const { payload } = await jwtDecrypt(token, key);
    return JSON.parse(payload.session as string) as TwitterSession;
  } catch {
    return null;
  }
}

// Cookie management
export async function getSessionFromCookies(): Promise<TwitterSession | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  if (!cookie?.value) return null;
  return decryptSession(cookie.value);
}

// Get valid access token, auto-refresh if expired
export async function getValidAccessToken(
  request: NextRequest
): Promise<{ token: string; session: TwitterSession; refreshed: boolean }> {
  const cookie = request.cookies.get(SESSION_COOKIE);
  if (!cookie?.value) {
    throw new Error("Not authenticated");
  }

  const session = await decryptSession(cookie.value);
  if (!session) {
    throw new Error("Invalid session");
  }

  // Check if token is expired (with 60s buffer)
  if (session.tokens.expires_at < Date.now() + 60000) {
    const newTokens = await refreshAccessToken(session.tokens.refresh_token);
    session.tokens = newTokens;
    return { token: newTokens.access_token, session, refreshed: true };
  }

  return { token: session.tokens.access_token, session, refreshed: false };
}
