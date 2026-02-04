"use client";

import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";
import { LogOut, Twitter, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface TwitterUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
}

export default function SocialPage() {
  const [user, setUser] = useState<TwitterUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check URL for OAuth errors
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("error");
    if (oauthError) {
      setError(`Authentication failed: ${oauthError}`);
      // Clean up URL
      window.history.replaceState({}, "", "/social");
    }

    // Fetch connection status
    fetch("/api/twitter/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.connected) {
          setUser(data.user);
        }
      })
      .catch(() => {
        // Not connected, that's fine
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDisconnect = async () => {
    // Clear the session cookie by calling a simple endpoint
    // For now, we'll just clear it client-side by making the browser delete it
    document.cookie =
      "twitter_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);
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
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {user.profile_image_url ? (
                  <img
                    src={user.profile_image_url}
                    alt={user.name}
                    className="w-7 h-7 rounded-full"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span className="text-gray-300 text-sm">@{user.username}</span>
                <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                  Connected
                </span>
              </div>
              <button
                onClick={handleDisconnect}
                className="text-gray-500 hover:text-gray-300 transition-colors"
                title="Disconnect"
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
              Connect Twitter / X
            </a>
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
