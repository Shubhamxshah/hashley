"use client";

import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";
import { LogOut, Twitter, Instagram, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface TwitterUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
}

interface InstagramUser {
  igUserId: string;
  username: string;
  name: string;
  profilePictureUrl?: string;
}

export default function SocialPage() {
  const [twitterUser, setTwitterUser] = useState<TwitterUser | null>(null);
  const [igUser, setIgUser] = useState<InstagramUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("error");
    if (oauthError) {
      setError(`Authentication failed: ${oauthError}`);
      window.history.replaceState({}, "", "/social");
    }

    Promise.all([
      fetch("/api/twitter/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.connected) setTwitterUser(data.user);
        })
        .catch(() => {}),
      fetch("/api/instagram/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.connected) setIgUser(data.user);
        })
        .catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const handleDisconnectTwitter = () => {
    document.cookie =
      "twitter_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setTwitterUser(null);
  };

  const handleDisconnectInstagram = () => {
    document.cookie =
      "instagram_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setIgUser(null);
  };

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
    >
      <div className="h-screen flex flex-col bg-black">
        {/* Top bar */}
        <div className="border-b border-gray-800 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <h1 className="text-white font-bold text-lg">Social Agent</h1>

          {loading ? (
            <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
          ) : (
            <div className="flex items-center gap-4">
              {/* Twitter */}
              {twitterUser ? (
                <div className="flex items-center gap-2">
                  {twitterUser.profile_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={twitterUser.profile_image_url}
                      alt={twitterUser.name}
                      className="w-7 h-7 rounded-full"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 text-xs font-bold">
                      {twitterUser.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-gray-300 text-sm">
                    @{twitterUser.username}
                  </span>
                  <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                    X
                  </span>
                  <button
                    onClick={handleDisconnectTwitter}
                    className="text-gray-500 hover:text-gray-300 transition-colors"
                    title="Disconnect Twitter"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <a
                  href="/api/auth/twitter"
                  className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-bold text-sm py-2 px-4 rounded-full transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  Connect X
                </a>
              )}

              {/* Instagram */}
              {igUser ? (
                <div className="flex items-center gap-2">
                  {igUser.profilePictureUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={igUser.profilePictureUrl}
                      alt={igUser.name}
                      className="w-7 h-7 rounded-full"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                      {igUser.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-gray-300 text-sm">
                    @{igUser.username}
                  </span>
                  <span className="text-xs text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full">
                    IG
                  </span>
                  <button
                    onClick={handleDisconnectInstagram}
                    className="text-gray-500 hover:text-gray-300 transition-colors"
                    title="Disconnect Instagram"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <a
                  href="/api/auth/instagram"
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:opacity-90 text-white font-bold text-sm py-2 px-4 rounded-full transition-opacity"
                >
                  <Instagram className="w-4 h-4" />
                  Connect Instagram
                </a>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 text-sm">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-300 hover:text-red-200 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Chat area */}
        <div className="flex-1 min-h-0">
          <MessageThreadFull contextKey="social-agent" />
        </div>
      </div>
    </TamboProvider>
  );
}
