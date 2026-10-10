import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquareWarning, Link2, Image, ShieldAlert, HeartHandshake, Award, Users, Volume2, ArrowRight } from "lucide-react";
import { createPageUrl } from "@/utils";
import { triggerHaptic } from "@/lib/haptics";
import VoiceAssistance from "./VoiceAssistance";
import EmergencyGuidanceModal from "./EmergencyGuidanceModal";
import ScamSimulationModal from "./ScamSimulationModal";
import TrustedContactModal from "./TrustedContactModal";

/**
 * SeniorHomeView Component
 * Dedicated Senior & Family Safety Mode Home Screen.
 * Renders prominent 48dp+ action cards, voice assistance controls, and emergency guidance.
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
      {/* Prominent Mode Switch Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-100">Active Mode</div>
            <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight">
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
          className="h-12 px-5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-emerald-400 border border-emerald-400/40 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
        >
          <span>SENIOR MODE → SWITCH TO NORMAL MODE</span>
        </button>
      </div>

      {/* Voice Assistance Bar */}
      <VoiceAssistance textToRead={homeSpeechText} title="🔊 Voice Guide for Home Screen" />

      {/* 4 Primary Action Cards Grid (High-Contrast, Large 48dp+ Targets) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Check A Message */}
        <button
          type="button"
          onClick={() => handleAction("MessageScanner")}
          className="group relative p-6 rounded-3xl border-2 border-cyan-500/50 bg-gradient-to-br from-cyan-950/40 to-slate-900 hover:border-cyan-400 text-left shadow-lg hover:shadow-cyan-500/10 transition-all active:scale-98 cursor-pointer flex flex-col justify-between min-h-[160px]"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <MessageSquareWarning className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              1-TAP SCAN
            </span>
          </div>
          <div>
            <h2 className="text-xl font-black font-display tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              CHECK A MESSAGE
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-300 mt-1">
              Inspect suspicious SMS, WhatsApp messages, or emails for scams.
            </p>
          </div>
        </button>

        {/* Card 2: Check A Link */}
        <button
          type="button"
          onClick={() => handleAction("LinkScanner")}
          className="group relative p-6 rounded-3xl border-2 border-blue-500/50 bg-gradient-to-br from-blue-950/40 to-slate-900 hover:border-blue-400 text-left shadow-lg hover:shadow-blue-500/10 transition-all active:scale-98 cursor-pointer flex flex-col justify-between min-h-[160px]"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Link2 className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
              LINK SAFETY
            </span>
          </div>
          <div>
            <h2 className="text-xl font-black font-display tracking-tight text-white group-hover:text-blue-300 transition-colors">
              CHECK A LINK
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-300 mt-1">
              Verify if a web link address or bank portal URL is safe before clicking.
            </p>
          </div>
        </button>

        {/* Card 3: Check A Screenshot */}
        <button
          type="button"
          onClick={() => handleAction("ScreenshotScanner")}
          className="group relative p-6 rounded-3xl border-2 border-purple-500/50 bg-gradient-to-br from-purple-950/40 to-slate-900 hover:border-purple-400 text-left shadow-lg hover:shadow-purple-500/10 transition-all active:scale-98 cursor-pointer flex flex-col justify-between min-h-[160px]"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Image className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
              VISION SCAN
            </span>
          </div>
          <div>
            <h2 className="text-xl font-black font-display tracking-tight text-white group-hover:text-purple-300 transition-colors">
              CHECK A SCREENSHOT
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-300 mt-1">
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
          className="group relative p-6 rounded-3xl border-2 border-rose-500 bg-gradient-to-br from-rose-950/60 to-slate-900 hover:border-rose-400 text-left shadow-xl hover:shadow-rose-500/20 transition-all active:scale-98 cursor-pointer flex flex-col justify-between min-h-[160px]"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/30 border border-rose-400/60 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-rose-500/30 text-rose-200 border border-rose-400">
              24/7 HELPLINE 1930
            </span>
          </div>
          <div>
            <h2 className="text-xl font-black font-display tracking-tight text-rose-400 group-hover:text-rose-300 transition-colors">
              GET EMERGENCY HELP
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">
              Transferred money or shared OTP? Open 100% offline emergency recovery steps.
            </p>
          </div>
        </button>
      </div>

      {/* Secondary Tools: Spot The Scam & Trusted Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Scam Simulation Practice */}
        <div className="p-5 rounded-3xl border border-amber-500/40 bg-amber-500/10 text-amber-100 flex items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="font-black text-base flex items-center gap-2 text-amber-400">
              <Award className="w-5 h-5" />
              <span>Can You Spot the Scam?</span>
            </h3>
            <p className="text-xs font-medium text-amber-200/90">
              Practice identifying real scam SMS and phone calls with interactive quiz cases.
            </p>
          </div>
          <button
            type="button"
            onClick={async () => {
              await triggerHaptic("light");
              setShowSimulationModal(true);
            }}
            className="h-11 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <span>Start Practice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Ask Trusted Contact */}
        <div className="p-5 rounded-3xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-100 flex items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="font-black text-base flex items-center gap-2 text-cyan-400">
              <Users className="w-5 h-5" />
              <span>Ask a Trusted Contact</span>
            </h3>
            <p className="text-xs font-medium text-cyan-200/90">
              Share scan findings with your family member or trusted guardian for safety verification.
            </p>
          </div>
          <button
            type="button"
            onClick={async () => {
              await triggerHaptic("light");
              setShowTrustedContactModal(true);
            }}
            className="h-11 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shrink-0 flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <span>Share Findings</span>
            <ArrowRight className="w-3.5 h-3.5" />
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
