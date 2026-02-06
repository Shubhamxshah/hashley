"use client";

import { useTamboComponentState } from "@tambo-ai/react";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  CheckCircle2,
  Loader2,
  XCircle,
  ExternalLink,
} from "lucide-react";
import * as React from "react";
import { z } from "zod";

export const xPostPreviewSchema = z.object({
  imageUrl: z.string().describe("URL of the generated image"),
  caption: z.string().describe("Tweet text / caption"),
  displayName: z
    .string()
    .optional()
    .describe("Display name from connected Twitter account"),
  username: z
    .string()
    .optional()
    .describe("@handle from connected Twitter account"),
  profileImageUrl: z
    .string()
    .optional()
    .describe("Avatar URL from connected Twitter account"),
  verified: z.boolean().optional().describe("Whether the account is verified"),
});

export type XPostPreviewProps = z.infer<typeof xPostPreviewSchema>;

type PostStatus = "pending" | "posting" | "posted" | "rejected" | "error";

interface PostState {
  status: PostStatus;
  tweetUrl?: string;
  errorMessage?: string;
}

interface TwitterUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
}

export const XPostPreview = React.forwardRef<HTMLDivElement, XPostPreviewProps>(
  (
    {
      imageUrl,
      caption,
      displayName: displayNameProp,
      username: usernameProp,
      profileImageUrl: profileImageUrlProp,
      verified: verifiedProp,
    },
    ref
  ) => {
    const [twitterUser, setTwitterUser] = React.useState<TwitterUser | null>(null);
    const [state, setState] = useTamboComponentState<PostState>(
      "x-post-preview",
      { status: "pending" }
    );
    const [imageLoaded, setImageLoaded] = React.useState(false);

    // Fetch connected Twitter user data on mount
    React.useEffect(() => {
      const fetchTwitterUser = async () => {
        try {
          const res = await fetch("/api/twitter/me");
          const data = await res.json();
          if (data.connected && data.user) {
            setTwitterUser(data.user);
          }
        } catch {
          // Silently fail - will use fallback values
        }
      };
      fetchTwitterUser();
    }, []);

    // Use props if provided, otherwise use fetched Twitter user data, otherwise fallback
    const displayName = displayNameProp || twitterUser?.name || "User";
    const username = usernameProp || twitterUser?.username || "user";
    const profileImageUrl = profileImageUrlProp || twitterUser?.profile_image_url;
    const verified = verifiedProp ?? false;

    const handleApprove = async () => {
      setState({ status: "posting" });

      try {
        const res = await fetch("/api/twitter/post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: caption, imageUrl }),
        });

        const data = await res.json();

        if (!res.ok) {
          setState({
            status: "error",
            errorMessage: data.error || "Failed to post tweet",
          });
          return;
        }

        setState({ status: "posted", tweetUrl: data.tweetUrl });
      } catch {
        setState({
          status: "error",
          errorMessage: "Network error. Please try again.",
        });
      }
    };

    const handleReject = () => {
      setState({ status: "rejected" });
    };

    const status = state?.status ?? "pending";

    return (
      <div ref={ref} className="w-full max-w-[598px] mx-auto">
        {/* X Post Card */}
        <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden">
          {/* Post header */}
          <div className="flex items-start gap-3 px-4 pt-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-white font-bold text-[15px] truncate">
                  {displayName}
                </span>
                {verified && (
                  <svg
                    viewBox="0 0 22 22"
                    className="w-[18px] h-[18px] fill-[#1d9bf0] flex-shrink-0"
                  >
                    <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.855-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.69-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.636.433 1.221.878 1.69.47.446 1.055.752 1.69.883.635.13 1.294.083 1.902-.144.271.586.702 1.084 1.24 1.438.54.354 1.167.551 1.813.568.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.225 1.261.276 1.894.147.634-.13 1.219-.434 1.69-.878.445-.47.749-1.055.878-1.69.13-.635.08-1.293-.143-1.9.588-.274 1.09-.706 1.443-1.246.353-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                  </svg>
                )}
                <span className="text-gray-500 text-[15px] truncate">
                  @{username}
                </span>
              </div>
            </div>
          </div>

          {/* Caption */}
          <div className="px-4 pt-1 pb-3">
            <p className="text-white text-[15px] leading-5 whitespace-pre-wrap">
              {caption}
            </p>
          </div>

          {/* Image */}
          <div className="px-4 pb-3">
            <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-gray-900">
              {!imageLoaded && (
                <div className="w-full aspect-square flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
                </div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={caption || "Generated image"}
                className={`w-full h-auto ${imageLoaded ? "block" : "hidden"}`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>

          {/* Timestamp */}
          <div className="px-4 pb-3">
            <span className="text-gray-500 text-[13px]">
              {new Date().toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}{" "}
              ·{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Engagement bar */}
          <div className="border-t border-gray-800 px-4 py-2">
            <div className="flex items-center justify-between max-w-[425px]">
              <button className="flex items-center gap-2 text-gray-500 hover:text-[#1d9bf0] transition-colors group">
                <MessageCircle className="w-[18px] h-[18px] group-hover:bg-[#1d9bf0]/10 rounded-full" />
                <span className="text-[13px]">0</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-[#00ba7c] transition-colors group">
                <Repeat2 className="w-[18px] h-[18px]" />
                <span className="text-[13px]">0</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-[#f91880] transition-colors group">
                <Heart className="w-[18px] h-[18px]" />
                <span className="text-[13px]">0</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-[#1d9bf0] transition-colors group">
                <Share className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>
        </div>

        {/* Action buttons / Status */}
        <div className="mt-4 flex items-center gap-3">
          {status === "pending" && (
            <>
              <button
                onClick={handleApprove}
                className="flex-1 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold py-2.5 px-6 rounded-full transition-colors text-[15px]"
              >
                Approve & Post
              </button>
              <button
                onClick={handleReject}
                className="flex-1 border border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white font-bold py-2.5 px-6 rounded-full transition-colors text-[15px]"
              >
                Reject
              </button>
            </>
          )}

          {status === "posting" && (
            <div className="flex items-center gap-2 text-gray-400 py-2.5">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-[15px]">Posting to X...</span>
            </div>
          )}

          {status === "posted" && (
            <div className="flex items-center gap-2 text-green-400 py-2.5">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-[15px]">Posted successfully!</span>
              {state?.tweetUrl && (
                <a
                  href={state.tweetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#1d9bf0] hover:underline text-[15px] ml-1"
                >
                  View tweet <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {status === "rejected" && (
            <div className="flex items-center gap-2 text-gray-500 py-2.5">
              <XCircle className="w-5 h-5" />
              <span className="text-[15px]">Post rejected</span>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col gap-2 py-2.5">
              <div className="flex items-center gap-2 text-red-400">
                <XCircle className="w-5 h-5" />
                <span className="text-[15px]">
                  {state?.errorMessage || "Something went wrong"}
                </span>
              </div>
              <button
                onClick={() => setState({ status: "pending" })}
                className="text-[#1d9bf0] hover:underline text-[14px] text-left"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

XPostPreview.displayName = "XPostPreview";

export default XPostPreview;
