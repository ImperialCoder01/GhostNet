import React, { useState } from "react";
import { Phone, ShieldAlert, X, AlertTriangle, ArrowRight, CheckCircle2, Lock, ExternalLink } from "lucide-react";
import VoiceAssistance from "./VoiceAssistance";
import { triggerHaptic } from "@/lib/haptics";

/**
 * EmergencyGuidanceModal Component
 * 100% Offline Emergency Scam Guidance for Senior Users.
 * Provides clear 5-step scenario playbooks for urgent help:
 * 1. Shared OTP / Password
 * 2. Transferred Money (Helpline 1930 + cybercrime.gov.in)
 * 3. Installed Suspicious App
 * 4. Shared Personal Info (Aadhaar / PAN)
 * 5. Extortion or Threat
 */
export default function EmergencyGuidanceModal({ isOpen, onClose }) {
  const [selectedScenario, setSelectedScenario] = useState("money");

  if (!isOpen) return null;

  const scenarios = [
    {
      id: "money",
      title: "💸 I Transferred Money to a Scammer",
      color: "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300",
      steps: [
        "📞 CALL 1930 IMMEDIATELY: Dial the National Cyber Crime Helpline at 1930 (India) within 1-2 hours to freeze stolen money in transit.",
        "🏦 CALL YOUR BANK: Ask your bank customer care to immediately freeze your netbanking and debit/credit cards.",
        "🌐 FILE ONLINE REPORT: Report the transaction details on https://cybercrime.gov.in with transaction ID / UTR number.",
        "🛑 DO NOT PAY AGAIN: Scammers will promise to refund your money if you pay more fee. It is a lie. Never send another rupee."
      ]
    },
    {
      id: "otp",
      title: "🔑 I Shared an OTP or Password",
      color: "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300",
      steps: [
        "🔐 CHANGE PASSWORDS: Immediately log in to your official banking app and change your login and transaction passwords.",
        "💳 FREEZE CARDS: Temporarily block your debit/credit cards using your official banking app or customer care.",
        "📱 CHECK SMS: Look at your recent SMS messages to confirm if any money was debited without your permission."
      ]
    },
    {
      id: "app",
      title: "📲 I Installed a Suspicious App",
      color: "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300",
      steps: [
        "✈️ TURN ON AIRPLANE MODE: Turn on Airplane Mode immediately to disconnect the scammer from viewing your screen.",
        "🗑️ UNINSTALL THE APP: Look for apps named AnyDesk, TeamViewer, QuickSupport, or downloaded APKs and tap Uninstall.",
        "⚙️ REVOKE PERMISSIONS: Go to Settings → Accessibility and turn OFF any unknown app permissions."
      ]
    },
    {
      id: "personal",
      title: "👤 I Shared My Aadhaar or PAN Details",
      color: "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300",
      steps: [
        "🔒 LOCK AADHAAR BIOMETRICS: Open the official mAadhaar app or resident.uidai.gov.in to lock your Aadhaar biometrics.",
        "📊 CHECK CREDIT SCORE: Check your CIBIL or Experian credit report to verify no unauthorized loans were opened in your name.",
        "⚠️ BE ALERT: Watch out for future fake calls claiming to be police, tax officers, or courier agents."
      ]
    },
    {
      id: "extortion",
      title: "⚠️ Someone Is Threatening or Blackmailing Me",
      color: "border-red-600 bg-red-600/10 text-red-700 dark:text-red-300",
      steps: [
        "🛑 DO NOT PANIC: Police and judges NEVER conduct 'Digital Arrests' over WhatsApp or Skype video calls.",
        "🔇 HANG UP IMMEDIATELY: Disconnect the call. Do not answer again.",
        "👨‍👩‍👧 TELL A TRUSTED FAMILY MEMBER: Share the details with a family member or local police station immediately."
      ]
    }
  ];

  const currentScenario = scenarios.find((s) => s.id === selectedScenario) || scenarios[0];
  const speechText = `Emergency Scam Guidance for ${currentScenario.title}. ${currentScenario.steps.join(". ")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-card border-2 border-slate-700 rounded-3xl shadow-2xl p-4 sm:p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-500 shrink-0">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black font-display tracking-tight text-rose-500">
                EMERGENCY SCAM HELP & GUIDE
              </h2>
              <p className="text-xs font-semibold text-slate-400">100% Offline Emergency Action Playbook</p>
            </div>
          </div>
          <button
            onClick={async () => {
              await triggerHaptic("light");
              onClose();
            }}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* National Helpline Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Phone className="w-8 h-8 animate-bounce shrink-0" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider opacity-90">National Cyber Crime Helpline (India)</div>
              <div className="text-2xl font-black font-mono">DIAL 1930</div>
            </div>
          </div>
          <a
            href="tel:1930"
            onClick={() => triggerHaptic("heavy")}
            className="h-12 px-5 rounded-xl bg-white text-rose-700 font-black text-sm flex items-center justify-center gap-2 hover:bg-rose-50 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Phone className="w-4 h-4 fill-current" />
            <span>Call 1930 Now</span>
          </a>
        </div>

        {/* Voice Assistance */}
        <VoiceAssistance textToRead={speechText} title="🔊 Listen to Emergency Instructions" />

        {/* Scenario Selector Tabs */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Select What Happened:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {scenarios.map((s) => (
              <button
                key={s.id}
                onClick={async () => {
                  await triggerHaptic("light");
                  setSelectedScenario(s.id);
                }}
                className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  selectedScenario === s.id
                    ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-md ring-1 ring-cyan-400"
                    : "border-slate-700 bg-slate-900/60 hover:border-slate-500 text-slate-300"
                }`}
              >
                <span>{s.title}</span>
                {selectedScenario === s.id && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Scenario Action Steps */}
        <div className={`p-4 sm:p-5 rounded-2xl border ${currentScenario.color} space-y-3`}>
          <h3 className="font-extrabold text-base sm:text-lg tracking-tight flex items-center gap-2">
            <Lock className="w-5 h-5" />
            <span>Recommended Action Steps:</span>
          </h3>
          <ol className="space-y-2 text-xs sm:text-sm font-semibold">
            {currentScenario.steps.map((step, idx) => (
              <li key={idx} className="p-3 rounded-xl bg-slate-950/40 border border-slate-700/50 leading-relaxed">
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={async () => {
              await triggerHaptic("light");
              onClose();
            }}
            className="h-11 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all cursor-pointer"
          >
            Close Help Guide
          </button>
        </div>
      </div>
    </div>
  );
}
