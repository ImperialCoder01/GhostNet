import React, { useState, useRef } from "react";
import { Mic, Upload, Square, Activity, AlertCircle, FileAudio } from "lucide-react";
import { Button } from "@/components/ui/button";
import FraudScoreDisplay from "./scanner/FraudScoreDisplay";
import { computeSpectralFlatness, combineVoiceThreatScore } from "@/lib/spectralFeatures";

export default function VoiceScanner() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [spectralScore, setSpectralScore] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);

  const startRecording = async () => {
    setErrorMsg("");
    setResult(null);
    setAudioBlob(null);
    setAudioUrl(null);

    if (!navigator.mediaDevices || !window.MediaRecorder) {
      setErrorMsg("Live recording is not supported in this browser. Please upload an audio file instead.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.warn("Microphone access failed:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setErrorMsg("Microphone access was denied. Please allow microphone access in your browser settings and try again.");
      } else {
        setErrorMsg("Could not access microphone. You can upload an audio file instead.");
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      setErrorMsg("Please select a valid audio file (WAV, MP3, WebM, M4A).");
      return;
    }

    setErrorMsg("");
    setResult(null);
    setAudioBlob(file);
    setAudioUrl(URL.createObjectURL(file));
  };

  const analyzeAudio = async () => {
    if (!audioBlob) return;
    setAnalyzing(true);
    setErrorMsg("");

    try {
      const arrayBuffer = await audioBlob.arrayBuffer();

      // Client-side acoustic flatness check
      let flatness = 0.5;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const decoded = await ctx.decodeAudioData(arrayBuffer.slice(0));
          const channelData = decoded.getChannelData(0);
          flatness = computeSpectralFlatness(channelData);
          setSpectralScore(flatness);
          await ctx.close();
        }
      } catch (e) {
        console.warn("Client acoustic analysis skipped:", e);
      }

      // Convert to base64
      const uint8 = new Uint8Array(arrayBuffer);
      let binary = "";
      for (let i = 0; i < uint8.length; i++) {
        binary += String.fromCharCode(uint8[i]);
      }
      const base64 = btoa(binary);

      const res = await fetch("/api/analyze-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audio_base64: base64,
          mime_type: audioBlob.type || "audio/webm",
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Voice analysis service returned an error.");
      }

      const data = await res.json();
      const combinedScore = combineVoiceThreatScore(data.fraud_score || 0, flatness);

      setResult({
        ...data,
        fraud_score: combinedScore,
        spectral_flatness: flatness,
      });
    } catch (err) {
      console.error("Audio analysis failed:", err);
      setErrorMsg(err.message || "Failed to analyze audio. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="ghost-card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold" style={{ color: "var(--ghost-text)" }}>
              Voice & Audio Threat Recorder
            </h3>
            <p className="text-xs" style={{ color: "var(--ghost-text-dim)" }}>
              Record or upload suspicious phone calls, voice notes, or synthetic AI deepfakes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                className="gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                <Mic className="w-4 h-4" /> Start Recording
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                variant="destructive"
                className="gap-2 animate-pulse"
              >
                <Square className="w-4 h-4" /> Stop Recording
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
              style={{ borderColor: "var(--ghost-border)" }}
            >
              <Upload className="w-4 h-4" /> Upload Audio
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {audioUrl && (
          <div className="p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ background: "var(--ghost-surface-2)", borderColor: "var(--ghost-border)" }}>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <FileAudio className="w-6 h-6 text-cyan-400" />
              <audio controls src={audioUrl} className="max-w-xs h-9" />
            </div>

            <Button
              onClick={analyzeAudio}
              disabled={analyzing}
              className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
            >
              {analyzing ? "Analyzing Waveform & Speech..." : "Analyze Audio"}
            </Button>
          </div>
        )}

        {errorMsg && (
          <div className="ghost-card p-4 border-rose-500/30 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
            <span className="text-xs font-medium text-rose-400">{errorMsg}</span>
          </div>
        )}
      </div>

      {result && (
        <div className="space-y-4">
          {result.transcript && (
            <div className="ghost-card p-4 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: "var(--ghost-text-dim)" }}>
                Transcribed Audio Content
              </span>
              <p className="text-xs font-mono p-3 rounded-lg border leading-relaxed"
                style={{ background: "var(--ghost-surface-2)", borderColor: "var(--ghost-border)", color: "var(--ghost-text)" }}>
                {result.transcript}
              </p>
            </div>
          )}

          {spectralScore !== null && (
            <div className="ghost-card p-4 flex items-center justify-between border" style={{ borderColor: "var(--ghost-border)" }}>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold" style={{ color: "var(--ghost-text)" }}>
                  Acoustic Spectral Flatness (Wiener Entropy)
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {spectralScore.toFixed(3)}
              </span>
            </div>
          )}

          <FraudScoreDisplay
            score={result.fraud_score}
            riskLevel={result.risk_level}
            confidence={result.confidence || "high"}
            reasons={result.reasons}
            analysis={result.analysis || result.ai_analysis}
            attackIntent={result.attack_intent}
            signals={result.signals}
            threatReconstruction={result.threat_reconstruction}
            similarPatterns={result.similar_patterns}
            reasonCodes={result.reasonCodes || []}
            source={result.source}
            rawScanData={{
              scan_type: "voice",
              input_content: result.transcript || "Voice scan",
              fraud_score: result.fraud_score,
              analysis: result.analysis || result.ai_analysis,
              reasons: result.reasons,
            }}
          />
        </div>
      )}
    </div>
  );
}
