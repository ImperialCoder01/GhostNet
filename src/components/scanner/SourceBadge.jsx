import React from "react";
import { CheckCircle, WifiOff } from "lucide-react";

/**
 * SourceBadge — shows which engine produced the verdict.
 * "groq" | "gemini" | "openai" → green AI Online badge
 * "offline-heuristic"           → amber Offline Mode badge
 * "community-threat-feed"       → blue Community Feed badge
 * "public-feed:*"               → red Public Blocklist badge
 * undefined / null              → nothing rendered
 */
export default function SourceBadge({ source }) {
  if (!source) return null;

  const isOffline = source === "offline-heuristic";
  const isCommunity = source === "community-threat-feed";
  const isPublicFeed = source?.startsWith("public-feed:");
  const feedName = isPublicFeed ? source.split(":")[1] : null;

  if (isOffline) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400">
        <WifiOff className="w-3 h-3" />
        Offline Mode — Heuristic Engine
      </span>
    );
  }

  if (isCommunity) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono border border-sky-500/40 bg-sky-500/10 text-sky-600 dark:text-sky-400">
        <CheckCircle className="w-3 h-3" />
        Community Threat Feed
      </span>
    );
  }

  if (isPublicFeed) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono border border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400">
        <CheckCircle className="w-3 h-3" />
        Public Blocklist: {feedName}
      </span>
    );
  }

  // AI engine online
  const label =
    source === "gemini" ? "Gemini Vision AI" :
    source === "openai" ? "OpenAI Vision AI" :
    "Groq AI Engine";

  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
      <CheckCircle className="w-3 h-3" />
      {label} Online
    </span>
  );
}
