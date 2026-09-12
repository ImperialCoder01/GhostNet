import React, { useRef, useState } from "react";
import { QrCode, X, AlertCircle } from "lucide-react";

/**
 * QRScanner — Feature 5
 *
 * Decodes a QR code from an uploaded image using jsqr + HTMLCanvasElement.
 * Calls onDecoded(payload) on success, onError(message) on failure.
 * Zero external state — fully self-contained.
 */
export default function QRScanner({ onDecoded, onError }) {
  const [preview, setPreview] = useState(null);
  const [decoding, setDecoding] = useState(false);
  const [localError, setLocalError] = useState("");
  const fileRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setLocalError("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setLocalError("Image exceeds 10MB limit.");
      return;
    }

    setLocalError("");
    setPreview(URL.createObjectURL(file));
    setDecoding(true);

    try {
      // Dynamically import jsqr to keep initial bundle lean
      const { default: jsQR } = await import("jsqr");

      const img = new Image();
      img.src = URL.createObjectURL(file);

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Image could not be loaded"));
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (!code || !code.data) {
        const msg = "No QR code detected in this image. Please try a clearer photo.";
        setLocalError(msg);
        onError?.(msg);
      } else {
        onDecoded?.(code.data);
      }
    } catch (err) {
      const msg = `QR decode failed: ${err?.message || "Unknown error"}`;
      setLocalError(msg);
      onError?.(msg);
    } finally {
      setDecoding(false);
    }
  };

  const clear = () => {
    setPreview(null);
    setLocalError("");
    setDecoding(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full h-52 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all hover:border-violet-500 hover:bg-violet-500/5 group"
          style={{ borderColor: "var(--ghost-border)", background: "var(--ghost-surface-2)" }}
        >
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <QrCode className="w-6 h-6 text-violet-400" />
          </div>
          <div className="text-center space-y-1">
            <span className="text-sm font-bold block" style={{ color: "var(--ghost-text)" }}>
              Upload an image containing a QR code
            </span>
            <span className="text-xs block" style={{ color: "var(--ghost-text-dim)" }}>
              PNG, JPG, WebP up to 10MB · Auto-decoded + Threat Analysis
            </span>
          </div>
        </button>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border p-2" style={{ background: "var(--ghost-surface-2)", borderColor: "var(--ghost-border)" }}>
          <img src={preview} alt="QR Preview" className="w-full rounded-xl max-h-72 object-contain bg-black/20 mx-auto" />
          <button
            onClick={clear}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-rose-500 text-white flex items-center justify-center transition-colors border border-white/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

      {decoding && (
        <div className="flex items-center gap-2 text-xs text-violet-400 font-medium p-3 rounded-xl border border-violet-500/20 bg-violet-500/10">
          <QrCode className="w-4 h-4 animate-pulse" />
          Decoding QR code...
        </div>
      )}

      {localError && !decoding && (
        <div className="ghost-card p-4 border-rose-500/30 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
          <span className="text-xs font-medium" style={{ color: "var(--ghost-text-dim)" }}>{localError}</span>
        </div>
      )}
    </div>
  );
}
