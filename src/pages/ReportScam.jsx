// @ts-nocheck
import React, { useRef, useState } from "react";
import { AlertTriangle, CheckCircle, Send, Upload, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ScannerHeader from "../components/scanner/ScannerHeader";
import { analyzeReport } from "@/lib/api";
import { createScamReport, uploadEvidenceFile } from "@/lib/data";

const EMPTY_FORM = {
  report_type: "",
  scam_content: "",
  phone_number: "",
  url: "",
  region: "",
  country: "",
};

export default function ReportScam() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setScreenshot(file);
    setPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setSubmitted(false);
    setForm(EMPTY_FORM);
    setScreenshot(null);
    setPreview(null);
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.report_type || !form.scam_content) return;
    setSubmitting(true);
    setError("");

    try {
      let screenshotUrl = "";
      if (screenshot) {
        screenshotUrl = await uploadEvidenceFile(screenshot);
        if (!screenshotUrl) {
          throw new Error("Could not upload the screenshot evidence to Supabase storage. Check that you are signed in and that the evidence bucket policies are applied.");
        }
      }

      const analysis = await analyzeReport(form);

      await createScamReport({
        ...form,
        screenshot_url: screenshotUrl,
        fraud_score: analysis.fraud_score,
        risk_level: analysis.risk_level,
        ai_analysis: analysis.ai_analysis,
        status: "pending",
      });

      setSubmitted(true);
    } catch (submitError) {
      setError(submitError?.message || "Could not submit the report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="space-y-4">
        <ScannerHeader
          icon={AlertTriangle}
          title="Report Scam"
          description="Help the community by reporting scams and sharing evidence."
          color="#ff647d"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="ghost-card p-8 text-center space-y-5"
        >
          <div className="w-18 h-18 rounded-full mx-auto flex items-center justify-center" style={{ background: "rgba(52,236,165,0.12)" }}>
            <CheckCircle className="w-9 h-9" style={{ color: "var(--ghost-green)" }} />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white">Report Submitted</h2>
            <p className="text-sm md:text-base mt-3 max-w-xl mx-auto" style={{ color: "var(--ghost-text-dim)" }}>
              Thank you for strengthening the community signal network. Your report has been saved and queued for further review.
            </p>
          </div>
          <Button
            onClick={resetForm}
            className="rounded-2xl h-11 px-5"
            style={{ background: "linear-gradient(135deg, #83e7ff, #34eca5)", color: "#05111f" }}
          >
            Submit Another Report
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ScannerHeader
        icon={AlertTriangle}
        title="Report Scam"
        description="Capture the message, link, phone number, or screenshot so GhostNet can help the community spot repeat threats."
        color="#ff647d"
      />

      <div className="ghost-card p-5 md:p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold mb-2 block" style={{ color: "#d9e7f7" }}>
              Scam Type *
            </label>
            <Select value={form.report_type} onValueChange={(value) => setForm({ ...form, report_type: value })}>
              <SelectTrigger
                className="h-12 bg-transparent rounded-2xl border"
                style={{ background: "rgba(255,255,255,0.04)", color: "var(--ghost-text)", borderColor: "rgba(129,162,216,0.14)" }}
              >
                <SelectValue placeholder="Select scam type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="message">Scam Message</SelectItem>
                <SelectItem value="link">Phishing Link</SelectItem>
                <SelectItem value="phone">Fraud Phone Number</SelectItem>
                <SelectItem value="website">Fake Website</SelectItem>
                <SelectItem value="screenshot">Screenshot Evidence</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="ghost-card-soft p-4">
            <p className="section-label mb-2">What makes a strong report</p>
            <p className="text-sm" style={{ color: "var(--ghost-text-dim)" }}>
              Include the exact message, suspicious link, phone number, and any screenshots. Specific evidence improves pattern matching and repeat-threat detection.
            </p>
          </div>
        </div>

        <div>
          <label className="text-sm font-bold mb-2 block" style={{ color: "#d9e7f7" }}>
            Scam Details *
          </label>
          <Textarea
            value={form.scam_content}
            onChange={(event) => setForm({ ...form, scam_content: event.target.value })}
            placeholder="Paste the suspicious message, describe what happened, or explain what the attacker asked you to do."
            className="min-h-[140px] bg-transparent resize-none text-sm rounded-2xl border px-4 py-3 focus-visible:ring-0"
            style={{ background: "rgba(255,255,255,0.04)", color: "var(--ghost-text)", borderColor: "rgba(129,162,216,0.14)" }}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold mb-2 block" style={{ color: "#d9e7f7" }}>
              Phone Number
            </label>
            <Input
              value={form.phone_number}
              onChange={(event) => setForm({ ...form, phone_number: event.target.value })}
              placeholder="+1 234 567 890"
              className="h-12 bg-transparent text-sm rounded-2xl border px-4 focus-visible:ring-0"
              style={{ background: "rgba(255,255,255,0.04)", color: "var(--ghost-text)", borderColor: "rgba(129,162,216,0.14)" }}
            />
          </div>

          <div>
            <label className="text-sm font-bold mb-2 block" style={{ color: "#d9e7f7" }}>
              Suspicious URL
            </label>
            <Input
              value={form.url}
              onChange={(event) => setForm({ ...form, url: event.target.value })}
              placeholder="https://..."
              className="h-12 bg-transparent text-sm rounded-2xl border px-4 focus-visible:ring-0"
              style={{ background: "rgba(255,255,255,0.04)", color: "var(--ghost-text)", borderColor: "rgba(129,162,216,0.14)" }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold mb-2 block" style={{ color: "#d9e7f7" }}>
              City or Region
            </label>
            <Input
              value={form.region}
              onChange={(event) => setForm({ ...form, region: event.target.value })}
              placeholder="Delhi"
              className="h-12 bg-transparent text-sm rounded-2xl border px-4 focus-visible:ring-0"
              style={{ background: "rgba(255,255,255,0.04)", color: "var(--ghost-text)", borderColor: "rgba(129,162,216,0.14)" }}
            />
          </div>

          <div>
            <label className="text-sm font-bold mb-2 block" style={{ color: "#d9e7f7" }}>
              Country
            </label>
            <Input
              value={form.country}
              onChange={(event) => setForm({ ...form, country: event.target.value })}
              placeholder="India"
              className="h-12 bg-transparent text-sm rounded-2xl border px-4 focus-visible:ring-0"
              style={{ background: "rgba(255,255,255,0.04)", color: "var(--ghost-text)", borderColor: "rgba(129,162,216,0.14)" }}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-bold mb-2 block" style={{ color: "#d9e7f7" }}>
            Screenshot Evidence
          </label>
          {!preview ? (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors"
              style={{ borderColor: "rgba(129,162,216,0.2)", background: "rgba(255,255,255,0.03)" }}
            >
              <Upload className="w-5 h-5" style={{ color: "#9db7d7" }} />
              <span className="text-sm font-semibold" style={{ color: "#dbe7f5" }}>
                Upload screenshot evidence
              </span>
              <span className="text-xs" style={{ color: "var(--ghost-text-soft)" }}>
                Helps identify fake branding, copied layouts, and embedded scam text
              </span>
            </button>
          ) : (
            <div className="relative inline-block">
              <img src={preview} alt="Evidence" className="h-32 rounded-2xl object-cover" />
              <button
                onClick={() => {
                  setScreenshot(null);
                  setPreview(null);
                }}
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: "var(--ghost-red)" }}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </div>

        {error ? (
          <div className="rounded-2xl px-4 py-3" style={{ background: "rgba(255,100,125,0.1)", color: "var(--ghost-red)" }}>
            <p className="text-sm font-semibold">{error}</p>
          </div>
        ) : null}

        <Button
          onClick={handleSubmit}
          disabled={submitting || !form.report_type || !form.scam_content}
          className="w-full h-12 rounded-2xl font-semibold"
          style={{ background: "linear-gradient(135deg, #ff7f96, #ff4a69)", color: "#fff" }}
        >
          <Send className="w-4 h-4 mr-2" />
          {submitting ? "Submitting..." : "Submit Report"}
        </Button>
      </div>
    </div>
  );
}
