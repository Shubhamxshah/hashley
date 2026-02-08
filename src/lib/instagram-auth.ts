import { EncryptJWT, jwtDecrypt } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

// Facebook Login OAuth for Instagram API
const FACEBOOK_AUTH_URL = "https://www.facebook.com/v21.0/dialog/oauth";
const FACEBOOK_TOKEN_URL =
  "https://graph.facebook.com/v21.0/oauth/access_token";
const GRAPH_API = "https://graph.facebook.com/v21.0";
const SCOPES =
  "pages_show_list,pages_read_engagement,instagram_basic,instagram_content_publish,business_management";

const SESSION_COOKIE = "instagram_session";

function getEncryptionKey(): Uint8Array {
  const secret = process.env.TOKEN_ENCRYPTION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("TOKEN_ENCRYPTION_SECRET must be at least 32 characters");
  }
  return new TextEncoder().encode(secret.slice(0, 32));
}

// State encryption for CSRF protection
export async function encryptState(nonce: string): Promise<string> {
  const key = getEncryptionKey();
  return new EncryptJWT({ nonce })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .encrypt(key);
}

export async function decryptState(
  state: string
): Promise<{ nonce: string } | null> {
  try {
    const key = getEncryptionKey();
    const { payload } = await jwtDecrypt(state, key);
    return { nonce: payload.nonce as string };
  } catch {
    return null;
  }
}

// OAuth URL — force re-auth so user selects Pages
export function getAuthorizationUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`,
    scope: SCOPES,
    response_type: "code",
    state,
    auth_type: "rerequest",
  });
  return `${FACEBOOK_AUTH_URL}?${params.toString()}`;
}

// Token exchange
export interface InstagramTokens {
  access_token: string;
  expires_at: number;
}

export async function exchangeCodeForTokens(
  code: string
): Promise<{ short_lived_token: string }> {
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID!,
    client_secret: process.env.FACEBOOK_APP_SECRET!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`,
    code,
  });

  const res = await fetch(`${FACEBOOK_TOKEN_URL}?${params.toString()}`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${text}`);
  }

  const data = await res.json();
  return { short_lived_token: data.access_token };
}

export async function getLongLivedToken(
  shortLivedToken: string
): Promise<InstagramTokens> {
  const params = new URLSearchParams({
    grant_type: "fb_exchange_token",
    client_id: process.env.FACEBOOK_APP_ID!,
    client_secret: process.env.FACEBOOK_APP_SECRET!,
    fb_exchange_token: shortLivedToken,
  });

  const res = await fetch(`${FACEBOOK_TOKEN_URL}?${params.toString()}`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Long-lived token exchange failed: ${text}`);
  }

  const data = await res.json();
  return {
    access_token: data.access_token,
    expires_at: Date.now() + (data.expires_in || 5184000) * 1000,
  };
}

// Fetch the Instagram Business/Creator account linked to user's Facebook Pages
export async function getInstagramAccount(
  accessToken: string
): Promise<{
  igUserId: string;
  username: string;
  profilePictureUrl: string;
  name: string;
}> {
  // Get user's Facebook Pages with their page access tokens
  const pagesRes = await fetch(
    `${GRAPH_API}/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${accessToken}`
  );

  if (!pagesRes.ok) {
    const text = await pagesRes.text();
    throw new Error(`Failed to fetch pages: ${text}`);
  }

  const pagesData = await pagesRes.json();
  const pages = pagesData.data || [];

  console.log(
    "Facebook Pages response:",
    JSON.stringify(pagesData, null, 2)
  );

  // Find a page with an Instagram business account
  const pageWithIG = pages.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p: any) => p.instagram_business_account
  );

  if (!pageWithIG) {
    throw new Error(
      `No Instagram Business or Creator account found linked to any of your ${pages.length} Facebook Page(s). Make sure your Instagram account is connected to a Facebook Page via Instagram app settings.`
    );
  }

  const igUserId = pageWithIG.instagram_business_account.id;

  // Get Instagram account details using page access token
  const igRes = await fetch(
    `${GRAPH_API}/${igUserId}?fields=username,profile_picture_url,name&access_token=${accessToken}`
  );

  if (!igRes.ok) {
    const text = await igRes.text();
    throw new Error(`Failed to fetch Instagram profile: ${text}`);
  }

  const igData = await igRes.json();

  return {
    igUserId,
    username: igData.username || "user",
    profilePictureUrl: igData.profile_picture_url || "",
    name: igData.name || igData.username || "User",
  };
}

// Session types
export interface InstagramSession {
  tokens: InstagramTokens;
  user: {
    igUserId: string;
    username: string;
    name: string;
    profilePictureUrl?: string;
  };
}

export async function encryptSession(
  session: InstagramSession
): Promise<string> {
  const key = getEncryptionKey();
  return new EncryptJWT({ session: JSON.stringify(session) })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime("60d")
    .encrypt(key);
}

export async function decryptSession(
  token: string
): Promise<InstagramSession | null> {
  try {
    const key = getEncryptionKey();
    const { payload } = await jwtDecrypt(token, key);
    return JSON.parse(payload.session as string) as InstagramSession;
  } catch {
    return null;
  }
}

// Cookie management
export async function getSessionFromCookies(): Promise<InstagramSession | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  if (!cookie?.value) return null;
  return decryptSession(cookie.value);
}

// Get valid access token (check expiry)
export async function getValidAccessToken(
  request: NextRequest
): Promise<{ token: string; session: InstagramSession }> {
  const cookie = request.cookies.get(SESSION_COOKIE);
  if (!cookie?.value) {
    throw new Error("Not authenticated");
  }

  const session = await decryptSession(cookie.value);
  if (!session) {
    throw new Error("Invalid session");
  }

  if (session.tokens.expires_at < Date.now() + 86400000) {
    throw new Error("Token expired. Please reconnect your Instagram account.");
  }

  return { token: session.tokens.access_token, session };
}
