import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Pause, Play, Square, Settings2, Globe } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

/**
 * VoiceAssistance Component
 * Built using native Web Speech API (window.speechSynthesis).
 * Requires ZERO paid API keys or external services.
 * Features: Read Aloud, Pause, Resume, Stop, Rate control, Language preference, and auto-unmount cancellation.
 */
export default function VoiceAssistance({ textToRead, title = "Listen to Explanation", autoClean = true }) {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [supported, setSupported] = useState(true);
  const [rate, setRate] = useState(1.0);
  const [lang, setLang] = useState("en-IN");
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      setSupported(false);
    }

    return () => {
      // Cancel speech when navigating away or unmounting
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const cleanText = (rawText) => {
    if (!rawText) return "";
    let text = rawText;
    // Strip URLs, raw numbers over 6 digits (OTPs/PINs), and HTML markup
    text = text.replace(/https?:\/\/\S+/gi, "link");
    text = text.replace(/\b\d{5,8}\b/g, "[verification code]");
    text = text.replace(/<[^>]*>/g, "");
    return text.trim();
  };

  const speak = async () => {
    await triggerHaptic("light");
    if (!supported || !textToRead) return;

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setSpeaking(true);
      setPaused(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any active speech before starting new announcement

    const targetText = autoClean ? cleanText(textToRead) : textToRead;
    const utterance = new SpeechSynthesisUtterance(targetText);
    utteranceRef.current = utterance;
    utterance.rate = rate;
    utterance.lang = lang;

    // Pick best available voice matching requested language if possible
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(
      (v) => v.lang.toLowerCase() === lang.toLowerCase() || v.lang.toLowerCase().startsWith(lang.slice(0, 2))
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      setSpeaking(true);
      setPaused(false);
    };

    utterance.onend = () => {
      setSpeaking(false);
      setPaused(false);
    };

    utterance.onerror = () => {
      setSpeaking(false);
      setPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const pause = async () => {
    await triggerHaptic("light");
    if (supported && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setSpeaking(false);
      setPaused(true);
    }
  };

  const stop = async () => {
    await triggerHaptic("light");
    if (supported) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setPaused(false);
    }
  };

  if (!supported) {
    return (
      <div className="text-xs p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300 flex items-center gap-2">
        <VolumeX className="w-4 h-4 shrink-0" />
        <span>Voice assistance is not supported on this browser or device.</span>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-3xl border bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-teal-500/10 dark:from-emerald-950/40 dark:to-teal-950/40 border-emerald-500/30 text-emerald-950 dark:text-emerald-100 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 font-black text-sm sm:text-base text-emerald-800 dark:text-emerald-300">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Volume2 className={`w-5 h-5 ${speaking ? "animate-pulse text-emerald-500" : ""}`} />
          </div>
          <span>{title}</span>
        </div>

        {/* Speed and Language Selectors */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <label className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-200">
            <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-emerald-500/40 text-emerald-950 dark:text-emerald-100 rounded-xl px-2 py-1 font-semibold text-xs focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm cursor-pointer"
            >
              <option value="en-IN">English (India)</option>
              <option value="hi-IN">Hindi (हिंदी)</option>
              <option value="en-US">English (US)</option>
            </select>
          </label>

          <label className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-200">
            <Settings2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <select
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="bg-white dark:bg-slate-900 border border-emerald-500/40 text-emerald-950 dark:text-emerald-100 rounded-xl px-2 py-1 font-semibold text-xs focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm cursor-pointer"
            >
              <option value={0.75}>0.75x Slow</option>
              <option value={1.0}>1.0x Normal</option>
              <option value={1.25}>1.25x Fast</option>
            </select>
          </label>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {!speaking ? (
          <button
            type="button"
            onClick={speak}
            className="h-11 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{paused ? "Resume Reading" : "Read Aloud"}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={pause}
            className="h-11 px-5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Pause className="w-4 h-4 fill-current" />
            <span>Pause Voice</span>
          </button>
        )}

        {(speaking || paused) && (
          <button
            type="button"
            onClick={stop}
            className="h-11 px-5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>Stop Reading</span>
          </button>
        )}
      </div>
    </div>
  );
}
