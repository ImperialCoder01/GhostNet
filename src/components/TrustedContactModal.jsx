import React, { useState } from "react";
import { Share2, Copy, Check, X, ShieldCheck, Users, HelpCircle } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import VoiceAssistance from "./VoiceAssistance";

/**
 * TrustedContactModal Component
 * User-initiated workflow to share scan findings with a trusted family member.
 * Options:
 * 1. Check Myself First
 * 2. Ask Trusted Contact (Native Share Sheet or Clipboard fallback)
 * 3. Cancel
 */
export default function TrustedContactModal({ isOpen, onClose, scanSummary }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const defaultText = scanSummary
    ? `GhostNet Safety Check Report:\nRisk: ${scanSummary.risk_level?.toUpperCase() || 'UNKNOWN'}\nFindings: ${scanSummary.analysis || 'Suspicious content detected.'}\nPlease help me review this message/link.`
    : `Hi! I ran a safety check on GhostNet and wanted your advice on a message/link I received.`;

  const handleNativeShare = async () => {
    await triggerHaptic("medium");
    if (navigator.share) {
      try {
        await navigator.share({
          title: "GhostNet Family Safety Check",
          text: defaultText,
        });
        onClose();
      } catch (e) {
        // Fallback to clipboard if share dismissed
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    await triggerHaptic("light");
    try {
      await navigator.clipboard.writeText(defaultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      setCopied(true);
    }
  };

  const speechText = "Trusted Contact Sharing. You can ask a family member or friend to inspect this message with you. Choose Share with Trusted Contact to send them a summary.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-card border-2 border-cyan-500/40 rounded-3xl shadow-2xl p-5 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight font-display">
                ASK A TRUSTED CONTACT
              </h3>
              <p className="text-xs font-semibold text-slate-400">Family & Guardian Safety Verification</p>
            </div>
          </div>
          <button
            onClick={async () => {
              await triggerHaptic("light");
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Voice Assistance */}
        <VoiceAssistance textToRead={speechText} title="🔊 Listen to Instructions" />

        {/* Preview Summary Box */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
          <div className="font-bold text-cyan-400 font-sans">Summary Preview to Send:</div>
          <p className="whitespace-pre-wrap leading-relaxed">{defaultText}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4 fill-current" />
            <span>Ask a Trusted Contact (Share)</span>
          </button>

          <button
            type="button"
            onClick={copyToClipboard}
            className="w-full h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied to Clipboard!" : "Copy Summary Text"}</span>
          </button>

          <button
            type="button"
            onClick={async () => {
              await triggerHaptic("light");
              onClose();
            }}
            className="w-full h-11 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 font-semibold text-xs transition-all cursor-pointer"
          >
            Check Myself First / Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
