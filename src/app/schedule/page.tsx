"use client";

import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Clock,
  Calendar,
  ChevronLeft,
} from "lucide-react";

const IMAGES = [
  "/generated/1770201925318-vecqdc.jpg",
  "/generated/1770202008840-133454.jpg",
  "/generated/1770202095033-dxkdd0.jpg",
  "/generated/1770213413950-gucr2s.jpg",
  "/generated/1770213523989-fbeih6.jpg",
  "/generated/1770213833553-q3wmra.jpg",
  "/generated/1770213963205-qrcim6.jpg",
  "/generated/1770214291199-zyohwy.jpg",
  "/generated/1770214680299-1rvoht.jpg",
  "/generated/1770214809310-f7to1g.jpg",
  "/generated/1770230572954-2sdzl4.jpg",
  "/generated/1770405141412-116uyz.jpg",
];

const SCHEDULED_POSTS = [
  {
    id: 1,
    content:
      "AI employees don't call in sick, don't need coffee breaks, and never miss a deadline. The future of work isn't coming — it's already here. #AIEmployees #FutureOfWork",
    scheduledFor: "2026-02-07T10:00:00",
    image: IMAGES[0],
  },
  {
    id: 2,
    content:
      "Stop spending 3 hours a day on emails. Our AI Executive Assistant handles your inbox, drafts replies, and filters junk — so you can focus on growing your business.",
    scheduledFor: "2026-02-07T14:30:00",
    image: IMAGES[1],
  },
  {
    id: 3,
    content:
      "New case study: How @DaveMarquis saved 200+ hours in his first month with Hashley AI employees. Full story on our blog.",
    scheduledFor: "2026-02-08T09:00:00",
    image: IMAGES[2],
  },
  {
    id: 4,
    content:
      "Your competitors are posting every day. You haven't posted in 2 weeks. Let Sonny, your AI Community Manager, fix that. No dancing required.",
    scheduledFor: "2026-02-08T17:00:00",
    image: IMAGES[3],
  },
  {
    id: 5,
    content:
      "Monday motivation: While you slept, your AI team answered 47 emails, published 2 blog posts, and generated 12 new leads. What did your human team do? #MondayMotivation",
    scheduledFor: "2026-02-09T08:00:00",
    image: IMAGES[4],
  },
  {
    id: 6,
    content:
      "\"I stumbled onto Hashley while desperately searching for help without blowing my budget on agencies. Best decision I've made.\" — DeiMarlon S., Small Business Owner",
    scheduledFor: "2026-02-09T13:00:00",
    image: IMAGES[5],
  },
  {
    id: 7,
    content:
      "SEO isn't dead. You just don't have time for it. Penny, our AI SEO Blog Writer, publishes optimized content daily while you run your business. Your rankings will thank you.",
    scheduledFor: "2026-02-10T10:30:00",
    image: IMAGES[6],
  },
  {
    id: 8,
    content:
      "Cold email tip: The best follow-up is the one that actually gets sent. Stan, our AI Sales Rep, never forgets to follow up. Ever.",
    scheduledFor: "2026-02-10T16:00:00",
    image: IMAGES[7],
  },
  {
    id: 9,
    content:
      "Most small business owners wear 6+ hats. CEO, marketer, sales rep, support agent, accountant, janitor. What if you could hand off 4 of those to AI? You can.",
    scheduledFor: "2026-02-11T09:00:00",
    image: IMAGES[8],
  },
  {
    id: 10,
    content:
      "Fun fact: Rachel, our AI Receptionist, has answered over 50,000 calls across all Hashley users. She never puts anyone on hold and always sounds cheerful.",
    scheduledFor: "2026-02-11T15:00:00",
    image: IMAGES[9],
  },
  {
    id: 11,
    content:
      "Legal docs shouldn't keep you up at night. Linda, our AI Legal Assistant, reviews contracts and explains them in plain English. Sleep better tonight.",
    scheduledFor: "2026-02-12T11:00:00",
    image: IMAGES[10],
  },
  {
    id: 12,
    content:
      "We just crossed 22,000+ businesses using Hashley. From solo freelancers to 50-person teams — AI employees scale with you. Join us.",
    scheduledFor: "2026-02-12T18:00:00",
    image: IMAGES[11],
  },
  {
    id: 13,
    content:
      "Weekend thought: The best time to hire an AI team was yesterday. The second best time is right now. 7-day money-back guarantee, no risk. #StartupLife #AI",
    scheduledFor: "2026-02-13T10:00:00",
    image: IMAGES[0],
  },
  {
    id: 14,
    content:
      "This week your AI team will: answer 100+ emails, post daily on social, write 3 blog posts, follow up with 20 leads, and answer every call. Cost? Less than one part-time hire.",
    scheduledFor: "2026-02-14T09:00:00",
    image: IMAGES[1],
  },
];

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatFullTimestamp(dateStr: string) {
  const date = new Date(dateStr);
  return (
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }) +
    " · " +
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  );
}

function getRelativeDay(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date("2026-02-07");
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diff = Math.round(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `In ${diff} days`;
}

function ScheduledPostCard({
  post,
}: {
  post: (typeof SCHEDULED_POSTS)[number];
}) {
  return (
    <div className="w-full">
      <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden">
        {/* Post header */}
        <div className="flex items-start gap-3 px-4 pt-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-bold">
              H
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-white font-bold text-[15px] truncate">
                Hashley
              </span>
              <svg
                viewBox="0 0 22 22"
                className="w-[18px] h-[18px] fill-[#1d9bf0] flex-shrink-0"
              >
                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.855-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.69-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.636.433 1.221.878 1.69.47.446 1.055.752 1.69.883.635.13 1.294.083 1.902-.144.271.586.702 1.084 1.24 1.438.54.354 1.167.551 1.813.568.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.225 1.261.276 1.894.147.634-.13 1.219-.434 1.69-.878.445-.47.749-1.055.878-1.69.13-.635.08-1.293-.143-1.9.588-.274 1.09-.706 1.443-1.246.353-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
              </svg>
              <span className="text-gray-500 text-[15px] truncate">
                @hashaboribos
              </span>
            </div>
          </div>
        </div>

        {/* Caption */}
        <div className="px-4 pt-1 pb-3">
          <p className="text-white text-[15px] leading-5 whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Image */}
        <div className="px-4 pb-3">
          <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-gray-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt={post.content.slice(0, 50)}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Timestamp + scheduled badge */}
        <div className="px-4 pb-3 flex items-center gap-2">
          <span className="text-gray-500 text-[13px]">
            {formatFullTimestamp(post.scheduledFor)}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            <Clock className="w-3 h-3" />
            Scheduled
          </span>
        </div>

        {/* Engagement bar */}
        <div className="border-t border-gray-800 px-4 py-2">
          <div className="flex items-center justify-between max-w-[425px]">
            <button className="flex items-center gap-2 text-gray-500 hover:text-[#1d9bf0] transition-colors group">
              <MessageCircle className="w-[18px] h-[18px]" />
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
    </div>
  );
}

export default function SchedulePage() {
  const [filter, setFilter] = useState<string>("all");

  // Group posts by date
  const grouped = SCHEDULED_POSTS.reduce<
    Record<string, typeof SCHEDULED_POSTS>
  >((acc, post) => {
    const dateKey = post.scheduledFor.split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(post);
    return acc;
  }, {});

  const dateKeys = Object.keys(grouped).sort();

  const filteredDateKeys =
    filter === "all" ? dateKeys : dateKeys.filter((k) => k === filter);

  return (
    <div className="min-h-screen bg-black text-white font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 h-14">
            <a
              href="/social"
              className="text-gray-400 hover:text-white transition-colors -ml-1 p-1.5 rounded-full hover:bg-gray-800"
            >
              <ChevronLeft className="w-5 h-5" />
            </a>
            <div>
              <h1 className="text-lg font-bold leading-tight">
                Scheduled Posts
              </h1>
              <p className="text-[13px] text-gray-500">
                {SCHEDULED_POSTS.length} posts · Feb 7 – 14, 2026
              </p>
            </div>
          </div>

          {/* Date filter pills */}
          <div className="flex gap-2 pb-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-[13px] rounded-full border transition-colors whitespace-nowrap ${
                filter === "all"
                  ? "bg-white text-black border-white font-bold"
                  : "border-gray-700 text-gray-400 hover:border-gray-500"
              }`}
            >
              All days
            </button>
            {dateKeys.map((dateKey) => {
              const label = getRelativeDay(dateKey);
              const d = new Date(dateKey + "T00:00:00");
              const shortDate = d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
              return (
                <button
                  key={dateKey}
                  onClick={() => setFilter(dateKey)}
                  className={`px-3 py-1.5 text-[13px] rounded-full border transition-colors whitespace-nowrap ${
                    filter === dateKey
                      ? "bg-white text-black border-white font-bold"
                      : "border-gray-700 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  {label === "Today" || label === "Tomorrow"
                    ? label
                    : shortDate}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="space-y-10">
          {filteredDateKeys.map((dateKey) => (
            <div key={dateKey}>
              {/* Date separator */}
              <div className="flex items-center gap-3 mb-5">
                <Calendar className="w-4 h-4 text-gray-600" />
                <h2 className="text-[15px] font-bold text-gray-300">
                  {formatDate(dateKey + "T00:00:00")}
                  <span className="ml-2 text-gray-600 font-normal text-[13px]">
                    {getRelativeDay(dateKey)}
                  </span>
                </h2>
                <div className="flex-1 h-px bg-gray-800" />
                <span className="text-[13px] text-gray-600">
                  {grouped[dateKey].length} posts
                </span>
              </div>

              {/* Post cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {grouped[dateKey].map((post) => (
                  <ScheduledPostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
