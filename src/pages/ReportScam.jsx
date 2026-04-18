import React, { useState, useRef } from "react";
import { AlertTriangle, Send, Upload, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ScannerHeader from "../components/scanner/ScannerHeader";
import { motion } from "framer-motion";
import { createScamReport, uploadEvidenceFile } from "@/lib/data";
import { analyzeReport } from "@/lib/api";

export default function ReportScam() {
  const [form, setForm] = useState({
    report_type: "",
    scam_content: "",
    phone_number: "",
    url: "",
    region: "",
    country: "",
  });
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshot(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.report_type || !form.scam_content) return;
    setSubmitting(true);

    let screenshot_url = "";
    if (screenshot) {
      screenshot_url = await uploadEvidenceFile(screenshot);
    }

    const analysis = await analyzeReport(form);

    await createScamReport({
      ...form,
      screenshot_url,
      fraud_score: analysis.fraud_score,
      risk_level: analysis.risk_level,
      ai_analysis: analysis.ai_analysis,
      status: "pending",
    });

    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="space-y-4">
        <ScannerHeader
          icon={AlertTriangle}
          title="Report Scam"
          description="Help the community by reporting scams"
          color="#ff3b5c"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="ghost-card p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
            style={{ background: 'rgba(0,255,136,0.1)' }}>
            <CheckCircle className="w-8 h-8" style={{ color: 'var(--ghost-green)' }} />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Report Submitted</h2>
          <p className="text-sm font-medium" style={{ color: '#a8c4e0' }}>
            Thank you for helping protect the community. Our AI will analyze your report.
          </p>
          <Button
            onClick={() => { setSubmitted(false); setForm({ report_type: "", scam_content: "", phone_number: "", url: "", region: "", country: "" }); setScreenshot(null); setPreview(null); }}
            className="rounded-xl"
            style={{ background: 'var(--ghost-surface-2)', color: 'var(--ghost-neon)' }}>
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
        description="Help the community by reporting scams you've encountered"
        color="#ff3b5c"
      />

      <div className="ghost-card p-4 space-y-4">
        <div>
          <label className="text-sm font-bold mb-2 block" style={{ color: '#a8c4e0' }}>
            Scam Type *
          </label>
          <Select value={form.report_type} onValueChange={(v) => setForm({ ...form, report_type: v })}>
            <SelectTrigger className="h-12 bg-transparent border-0 rounded-xl"
              style={{ background: 'var(--ghost-surface-2)', color: 'var(--ghost-text)' }}>
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

        <div>
          <label className="text-sm font-bold mb-2 block" style={{ color: '#a8c4e0' }}>
            Scam Details *
          </label>
          <Textarea
            value={form.scam_content}
            onChange={(e) => setForm({ ...form, scam_content: e.target.value })}
            placeholder="Describe the scam... paste the message, explain what happened"
            className="min-h-[100px] bg-transparent border-0 resize-none text-sm focus-visible:ring-0 rounded-xl"
            style={{ background: 'var(--ghost-surface-2)', color: 'var(--ghost-text)' }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-bold mb-1.5 block" style={{ color: '#a8c4e0' }}>
              Phone Number
            </label>
            <Input
              value={form.phone_number}
              onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
              placeholder="+1 234 567 890"
              className="h-10 bg-transparent border-0 text-sm focus-visible:ring-0 rounded-xl"
              style={{ background: 'var(--ghost-surface-2)', color: 'var(--ghost-text)' }}
            />
          </div>
          <div>
            <label className="text-sm font-bold mb-1.5 block" style={{ color: '#a8c4e0' }}>
              Suspicious URL
            </label>
            <Input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://..."
              className="h-10 bg-transparent border-0 text-sm focus-visible:ring-0 rounded-xl"
              style={{ background: 'var(--ghost-surface-2)', color: 'var(--ghost-text)' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-bold mb-1.5 block" style={{ color: '#a8c4e0' }}>
              City/Region
            </label>
            <Input
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
              placeholder="New York"
              className="h-10 bg-transparent border-0 text-sm focus-visible:ring-0 rounded-xl"
              style={{ background: 'var(--ghost-surface-2)', color: 'var(--ghost-text)' }}
            />
          </div>
          <div>
            <label className="text-sm font-bold mb-1.5 block" style={{ color: '#a8c4e0' }}>
              Country
            </label>
            <Input
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              placeholder="USA"
              className="h-10 bg-transparent border-0 text-sm focus-visible:ring-0 rounded-xl"
              style={{ background: 'var(--ghost-surface-2)', color: 'var(--ghost-text)' }}
            />
          </div>
        </div>

        {/* Screenshot Upload */}
        <div>
          <label className="text-sm font-bold mb-2 block" style={{ color: '#a8c4e0' }}>
            Screenshot Evidence
          </label>
          {!preview ? (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors"
              style={{ borderColor: 'var(--ghost-border)', background: 'rgba(0,0,0,0.2)' }}>
              <Upload className="w-5 h-5" style={{ color: '#8fa8c8' }} />
              <span className="text-sm font-medium" style={{ color: '#8fa8c8' }}>Upload screenshot</span>
            </button>
          ) : (
            <div className="relative inline-block">
              <img src={preview} alt="Evidence" className="h-24 rounded-xl object-cover" />
              <button onClick={() => { setScreenshot(null); setPreview(null); }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: 'var(--ghost-red)' }}>
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={submitting || !form.report_type || !form.scam_content}
          className="w-full h-12 rounded-xl font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #ff3b5c, #dc2626)' }}>
          <Send className="w-4 h-4 mr-2" />
          {submitting ? "Submitting..." : "Submit Report"}
        </Button>
      </div>
    </div>
  );
}
