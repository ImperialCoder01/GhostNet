import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquareWarning, Link2, Image, ShieldAlert, HeartHandshake, Award, Users, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { createPageUrl } from "@/utils";
import { triggerHaptic } from "@/lib/haptics";
import VoiceAssistance from "./VoiceAssistance";
import EmergencyGuidanceModal from "./EmergencyGuidanceModal";
import ScamSimulationModal from "./ScamSimulationModal";
import TrustedContactModal from "./TrustedContactModal";

/**
 * SeniorHomeView Component
 * Dedicated Senior & Family Safety Mode Home Screen.
 * Enhanced with high-contrast theme-aware cards, executive styling, and zero visual clutter.
 */
export default function SeniorHomeView({ onSwitchToNormalMode }) {
  const navigate = useNavigate();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showSimulationModal, setShowSimulationModal] = useState(false);
  const [showTrustedContactModal, setShowTrustedContactModal] = useState(false);

  const homeSpeechText = `
    Welcome to GhostNet Senior Mode. 
    Select Check a Message to inspect SMS or WhatsApp text. 
    Select Check a Link to test a website address. 
    Select Check a Screenshot to scan an image or QR code. 
    Select Get Emergency Help if you lost money or shared your password.
  `.trim();

  const handleAction = async (pageName, stateObj) => {
    await triggerHaptic("medium");
    navigate(createPageUrl(pageName), { state: stateObj });
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      {/* Prominent Active Mode Header Banner */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-xl border border-emerald-400/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center shrink-0 shadow-inner">
            <HeartHandshake className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-white/20 text-white border border-white/30">
                ACTIVE PROTECTION
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight mt-1 text-white">
              SENIOR & FAMILY SAFETY MODE
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={async () => {
            await triggerHaptic("medium");
            onSwitchToNormalMode();
          }}
          className="h-11 px-5 rounded-2xl bg-slate-950/80 hover:bg-slate-950 text-emerald-300 border border-emerald-400/50 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer backdrop-blur"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>SWITCH TO NORMAL MODE</span>
        </button>
      </div>

      {/* Voice Assistance Bar */}
      <VoiceAssistance textToRead={homeSpeechText} title="🔊 Voice Guide for Home Screen" />

      {/* 4 Primary Action Cards Grid (Theme-Aware High Contrast) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Check A Message */}
        <button
          type="button"
          onClick={() => handleAction("MessageScanner")}
          className="group relative p-6 rounded-3xl border-2 border-cyan-500/40 dark:border-cyan-500/60 bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent dark:from-cyan-950/70 dark:to-slate-950 hover:border-cyan-400 text-left shadow-md hover:shadow-cyan-500/15 transition-all active:scale-98 cursor-pointer flex flex-col justify-between min-h-[170px]"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <MessageSquareWarning className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono font-black px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40">
              1-TAP SCAN
            </span>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-black font-display tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
              CHECK A MESSAGE
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 mt-1 leading-relaxed">
              Inspect suspicious SMS, WhatsApp messages, or emails for scams.
            </p>
          </div>
        </button>

        {/* Card 2: Check A Link */}
        <button
          type="button"
          onClick={() => handleAction("LinkScanner")}
          className="group relative p-6 rounded-3xl border-2 border-blue-500/40 dark:border-blue-500/60 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent dark:from-blue-950/70 dark:to-slate-950 hover:border-blue-400 text-left shadow-md hover:shadow-blue-500/15 transition-all active:scale-98 cursor-pointer flex flex-col justify-between min-h-[170px]"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <Link2 className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono font-black px-3 py-1 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/40">
              LINK SAFETY
            </span>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-black font-display tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
              CHECK A LINK
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 mt-1 leading-relaxed">
              Verify if a web link address or bank portal URL is safe before clicking.
            </p>
          </div>
        </button>

        {/* Card 3: Check A Screenshot */}
        <button
          type="button"
          onClick={() => handleAction("ScreenshotScanner")}
          className="group relative p-6 rounded-3xl border-2 border-purple-500/40 dark:border-purple-500/60 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent dark:from-purple-950/70 dark:to-slate-950 hover:border-purple-400 text-left shadow-md hover:shadow-purple-500/15 transition-all active:scale-98 cursor-pointer flex flex-col justify-between min-h-[170px]"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <Image className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono font-black px-3 py-1 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/40">
              VISION SCAN
            </span>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-black font-display tracking-tight text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
              CHECK A SCREENSHOT
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 mt-1 leading-relaxed">
              Upload a chat photo, payment QR code, or screenshot to check for fraud.
            </p>
          </div>
        </button>

        {/* Card 4: Get Emergency Help */}
        <button
          type="button"
          onClick={async () => {
            await triggerHaptic("heavy");
            setShowEmergencyModal(true);
          }}
          className="group relative p-6 rounded-3xl border-2 border-rose-500 bg-gradient-to-br from-rose-500/20 via-rose-500/10 to-transparent dark:from-rose-950/80 dark:to-slate-950 hover:border-rose-400 text-left shadow-xl hover:shadow-rose-500/20 transition-all active:scale-98 cursor-pointer flex flex-col justify-between min-h-[170px]"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-500/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono font-black px-3 py-1 rounded-full bg-rose-500/25 text-rose-700 dark:text-rose-200 border border-rose-500/40">
              24/7 HELPLINE 1930
            </span>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-black font-display tracking-tight text-rose-700 dark:text-rose-400 group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors">
              GET EMERGENCY HELP
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 leading-relaxed">
              Transferred money or shared OTP? Open 100% offline emergency recovery steps.
            </p>
          </div>
        </button>
      </div>

      {/* Secondary Practice & Sharing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Spot The Scam */}
        <div className="p-5 rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent dark:from-amber-950/60 dark:to-slate-950 text-slate-900 dark:text-amber-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <h3 className="font-black text-base flex items-center gap-2 text-amber-800 dark:text-amber-400">
              <Award className="w-5 h-5" />
              <span>Can You Spot the Scam?</span>
            </h3>
            <p className="text-xs font-semibold text-slate-700 dark:text-amber-200/90 leading-relaxed">
              Practice identifying real scam SMS and phone calls with interactive quiz cases.
            </p>
          </div>
          <button
            type="button"
            onClick={async () => {
              await triggerHaptic("light");
              setShowSimulationModal(true);
            }}
            className="h-11 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shrink-0 flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <span>Start Practice</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Ask Trusted Contact */}
        <div className="p-5 rounded-3xl border-2 border-cyan-500/40 bg-gradient-to-br from-cyan-500/15 via-cyan-500/5 to-transparent dark:from-cyan-950/60 dark:to-slate-950 text-slate-900 dark:text-cyan-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <h3 className="font-black text-base flex items-center gap-2 text-cyan-800 dark:text-cyan-400">
              <Users className="w-5 h-5" />
              <span>Ask a Trusted Contact</span>
            </h3>
            <p className="text-xs font-semibold text-slate-700 dark:text-cyan-200/90 leading-relaxed">
              Share scan findings with your family member or trusted guardian for safety verification.
            </p>
          </div>
          <button
            type="button"
            onClick={async () => {
              await triggerHaptic("light");
              setShowTrustedContactModal(true);
            }}
            className="h-11 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 font-black text-xs shrink-0 flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <span>Share Findings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <EmergencyGuidanceModal isOpen={showEmergencyModal} onClose={() => setShowEmergencyModal(false)} />
      <ScamSimulationModal isOpen={showSimulationModal} onClose={() => setShowSimulationModal(false)} />
      <TrustedContactModal isOpen={showTrustedContactModal} onClose={() => setShowTrustedContactModal(false)} />
    </div>
  );
}
