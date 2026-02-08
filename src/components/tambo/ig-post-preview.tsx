"use client";

import { useTamboComponentState } from "@tambo-ai/react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  CheckCircle2,
  Loader2,
  XCircle,
  ExternalLink,
} from "lucide-react";
import * as React from "react";
import { z } from "zod";

export const igPostPreviewSchema = z.object({
  imageUrl: z.string().describe("URL of the generated image"),
  caption: z.string().describe("Instagram caption text"),
  displayName: z
    .string()
    .optional()
    .describe("Display name from connected Instagram account"),
  username: z
    .string()
    .optional()
    .describe("@handle from connected Instagram account"),
  profileImageUrl: z
    .string()
    .optional()
    .describe("Avatar URL from connected Instagram account"),
  verified: z.boolean().optional().describe("Whether the account is verified"),
});

export type IGPostPreviewProps = z.infer<typeof igPostPreviewSchema>;

type PostStatus = "pending" | "posting" | "posted" | "rejected" | "error";

interface PostState {
  status: PostStatus;
  postUrl?: string;
  errorMessage?: string;
}

interface InstagramUser {
  igUserId: string;
  username: string;
  name: string;
  profilePictureUrl?: string;
}

export const IGPostPreview = React.forwardRef<HTMLDivElement, IGPostPreviewProps>(
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
    const [igUser, setIgUser] = React.useState<InstagramUser | null>(null);
    const [state, setState] = useTamboComponentState<PostState>(
      "ig-post-preview",
      { status: "pending" }
    );
    const [imageLoaded, setImageLoaded] = React.useState(false);

    React.useEffect(() => {
      const fetchIGUser = async () => {
        try {
          const res = await fetch("/api/instagram/me");
          const data = await res.json();
          if (data.connected && data.user) {
            setIgUser(data.user);
          }
        } catch {
          // Silently fail - will use fallback values
        }
      };
      fetchIGUser();
    }, []);

    const displayName = displayNameProp || igUser?.name || "User";
    const username = usernameProp || igUser?.username || "user";
    const profileImageUrl =
      profileImageUrlProp || igUser?.profilePictureUrl;
    const verified = verifiedProp ?? false;

    const handleApprove = async () => {
      setState({ status: "posting" });

      try {
        const res = await fetch("/api/instagram/post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ caption, imageUrl }),
        });

        const data = await res.json();

        if (!res.ok) {
          setState({
            status: "error",
            errorMessage: data.error || "Failed to post to Instagram",
          });
          return;
        }

        setState({ status: "posted", postUrl: data.postUrl });
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
      <div ref={ref} className="w-full max-w-[470px] mx-auto">
        {/* Instagram Post Card */}
        <div className="bg-black border border-gray-800 rounded-lg overflow-hidden">
          {/* Post header */}
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px] flex-shrink-0">
              <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center">
                {profileImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profileImageUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-xs font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <span className="text-white font-semibold text-sm truncate">
                {username}
              </span>
              {verified && (
                <svg
                  viewBox="0 0 40 40"
                  className="w-3.5 h-3.5 fill-[#0095f6] flex-shrink-0"
                >
                  <path d="M19.998 3.094L14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v6.354h6.234L14.638 40l5.36-3.094L25.358 40l2.972-5.15h6.234v-6.354L40 25.359 36.905 20 40 14.641l-5.436-3.137V5.15h-6.234L25.358 0l-5.36 3.094zM18 27.094l-6.5-6.5 2.5-2.5 4 4 8-8 2.5 2.5-10.5 10.5z" />
                </svg>
              )}
            </div>
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 fill-white flex-shrink-0"
            >
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="6" cy="12" r="1.5" />
              <circle cx="18" cy="12" r="1.5" />
            </svg>
          </div>

          {/* Image */}
          <div className="relative bg-gray-900 aspect-square">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={caption || "Generated image"}
              className={`w-full h-full object-cover ${imageLoaded ? "block" : "hidden"}`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          {/* Action icons */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <Heart className="w-6 h-6 text-white cursor-pointer hover:text-gray-400 transition-colors" />
              <MessageCircle className="w-6 h-6 text-white cursor-pointer hover:text-gray-400 transition-colors" />
              <Send className="w-6 h-6 text-white cursor-pointer hover:text-gray-400 transition-colors" />
            </div>
            <Bookmark className="w-6 h-6 text-white cursor-pointer hover:text-gray-400 transition-colors" />
          </div>

          {/* Likes */}
          <div className="px-4 pb-1">
            <span className="text-white text-sm font-semibold">0 likes</span>
          </div>

          {/* Caption */}
          <div className="px-4 pb-3">
            <p className="text-white text-sm">
              <span className="font-semibold mr-1">{username}</span>
              <span className="whitespace-pre-wrap">{caption}</span>
            </p>
          </div>

          {/* Timestamp */}
          <div className="px-4 pb-3">
            <span className="text-gray-500 text-[10px] uppercase">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Action buttons / Status */}
        <div className="mt-4 flex items-center gap-3">
          {status === "pending" && (
            <>
              <button
                onClick={handleApprove}
                className="flex-1 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:opacity-90 text-white font-bold py-2.5 px-6 rounded-full transition-opacity text-[15px]"
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
              <span className="text-[15px]">Posting to Instagram...</span>
            </div>
          )}

          {status === "posted" && (
            <div className="flex items-center gap-2 text-green-400 py-2.5">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-[15px]">Posted successfully!</span>
              {state?.postUrl && (
                <a
                  href={state.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-pink-400 hover:underline text-[15px] ml-1"
                >
                  View post <ExternalLink className="w-3.5 h-3.5" />
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
                className="text-pink-400 hover:underline text-[14px] text-left"
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

IGPostPreview.displayName = "IGPostPreview";

export default IGPostPreview;
