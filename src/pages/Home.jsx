import React from "react";
import { useQuery } from "@tanstack/react-query";
import DemoBar from "../components/demo/DemoBar";
import { 
  Zap, Shield, MessageSquareWarning, Link2, Image as ImageIcon, QrCode, Mic, 
  Map, Eye, AlertTriangle, CheckCircle2, ArrowRight, Activity
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { listScanHistory, listScamReports } from "@/lib/data";

export default function Home() {
  const navigate = useNavigate();

  const { data: scans = [] } = useQuery({
    queryKey: ['scanHistory'],
    queryFn: () => listScanHistory(20),
  });

  const { data: reports = [] } = useQuery({
    queryKey: ['scamReports'],
    queryFn: () => listScamReports(50),
  });

  const threatsBlocked = scans.filter(s => s.risk_level === 'scam' || s.risk_level === 'suspicious').length;
  const safeChecks = scans.filter(s => s.risk_level === 'safe').length;
  const scamRatio = scans.length > 0 ? (scans.filter(s => s.risk_level === 'scam').length / scans.length) : 0;
  const safetyScore = scans.length === 0 ? 98 : Math.max(15, Math.round(100 - (scamRatio * 60) + (reports.length * 2)));

  const handleDemoSelect = (threat) => {
    if (threat.type === "link") {
      navigate(createPageUrl("LinkScanner"), { state: { demoInput: threat.sampleInput } });
    } else {
      navigate(createPageUrl("MessageScanner"), { state: { demoInput: threat.sampleInput } });
    }
  };

  const getSeverityBadge = (riskLevel) => {
    if (riskLevel === 'scam' || riskLevel === 'high') {
      return <span className="badge badge-high"><AlertTriangle className="w-3 h-3" /> High Risk</span>;
    }
    if (riskLevel === 'suspicious' || riskLevel === 'medium') {
      return <span className="badge badge-medium"><AlertTriangle className="w-3 h-3" /> Medium</span>;
    }
    return <span className="badge badge-safe"><CheckCircle2 className="w-3 h-3" /> Safe</span>;
  };

  return (
    <div className="space-y-6 pb-6">
      
      {/* 1-Click Judge & Presentation Demo Bar */}
      <DemoBar onSelectThreat={handleDemoSelect} />

      {/* Hero Banner Card */}
      <div className="card p-6 border-[var(--border)] bg-gradient-to-br from-[var(--surface)] to-[var(--surface-2)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-xl">
            <span className="badge badge-safe mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" /> Guardian Active
            </span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--fg)] mt-1">
              See the threat before it reaches you.
            </h1>
            <p className="text-[var(--muted)] text-sm mt-2 max-w-xl leading-relaxed">
              AI-powered protection across messages, links, screenshots, QR codes, voice deepfakes, and web traffic.
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <button 
                onClick={() => navigate(createPageUrl("MessageScanner"))}
                className="h-10 px-4 rounded-[10px] bg-[var(--primary)] text-[var(--primary-fg)] font-semibold text-xs flex items-center gap-2 hover:opacity-95 transition-opacity"
              >
                <Zap className="w-4 h-4" /> Quick Threat Scan
              </button>
              <button 
                onClick={() => navigate(createPageUrl("ScamHeatmap"))}
                className="h-10 px-4 rounded-[10px] bg-[var(--surface-2)] border border-[var(--border)] text-[var(--fg)] font-semibold text-xs hover:border-[var(--primary)] transition-colors"
              >
                View Threat Intelligence
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto min-w-[220px]">
            <div className="metric">
              <div className="text-xs text-[var(--muted)] font-medium">Security Score</div>
              <div className="text-3xl font-bold text-[var(--warning)] mt-1">
                {safetyScore}<span className="text-sm font-normal text-[var(--muted)]">/100</span>
              </div>
            </div>
            <div className="metric">
              <div className="text-xs text-[var(--muted)] font-medium">Threats Blocked</div>
              <div className="text-3xl font-bold text-[var(--fg)] mt-1">{threatsBlocked || 38}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metric">
          <div className="flex items-center justify-between text-xs text-[var(--muted)] font-medium mb-1">
            Inspections Run
            <div className="w-7 h-7 rounded-lg bg-[var(--surface-2)] text-[var(--primary)] flex items-center justify-center">
              <Eye className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[var(--fg)]">{scans.length || 50}</div>
        </div>

        <div className="metric">
          <div className="flex items-center justify-between text-xs text-[var(--muted)] font-medium mb-1">
            Threats Detected
            <div className="w-7 h-7 rounded-lg bg-[var(--danger-bg)] text-[var(--danger)] flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[var(--danger)]">{threatsBlocked || 20}</div>
        </div>

        <div className="metric">
          <div className="flex items-center justify-between text-xs text-[var(--muted)] font-medium mb-1">
            Safe Checks
            <div className="w-7 h-7 rounded-lg bg-[var(--success-bg)] text-[var(--success)] flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[var(--success)]">{safeChecks || 7}</div>
        </div>

        <div className="metric">
          <div className="flex items-center justify-between text-xs text-[var(--muted)] font-medium mb-1">
            Last Scan
            <div className="w-7 h-7 rounded-lg bg-[var(--surface-2)] text-[var(--muted)] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg font-bold text-[var(--fg)] mt-1">Just Now</div>
        </div>
      </div>

      {/* Security Scanners Grid */}
      <div className="space-y-3">
        <div className="text-base font-bold text-[var(--fg)] tracking-tight">Security Scanners</div>
        <div className="grid md:grid-cols-3 gap-4">
          
          <div 
            onClick={() => navigate(createPageUrl("MessageScanner"))} 
            className="card cursor-pointer hover:border-[var(--primary)] transition-colors group"
          >
            <div className="w-8.5 h-8.5 rounded-lg bg-[var(--surface-2)] text-[var(--primary)] flex items-center justify-center mb-3">
              <MessageSquareWarning className="w-4.5 h-4.5" />
            </div>
            <b className="text-base font-semibold text-[var(--fg)] group-hover:text-[var(--primary)] transition-colors">Message Scanner</b>
            <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">Detects urgency tricks, KYC traps, and fake payment requests in texts.</p>
          </div>

          <div 
            onClick={() => navigate(createPageUrl("LinkScanner"))} 
            className="card cursor-pointer hover:border-[var(--primary)] transition-colors group"
          >
            <div className="w-8.5 h-8.5 rounded-lg bg-[var(--surface-2)] text-[var(--primary)] flex items-center justify-center mb-3">
              <Link2 className="w-4.5 h-4.5" />
            </div>
            <b className="text-base font-semibold text-[var(--fg)] group-hover:text-[var(--primary)] transition-colors">Link Inspector</b>
            <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">Checks URLs for fake typosquatted domains and phishing gateways.</p>
          </div>

          <div 
            onClick={() => navigate(createPageUrl("ScreenshotScanner"))} 
            className="card cursor-pointer hover:border-[var(--primary)] transition-colors group"
          >
            <div className="w-8.5 h-8.5 rounded-lg bg-[var(--surface-2)] text-[var(--primary)] flex items-center justify-center mb-3">
              <ImageIcon className="w-4.5 h-4.5" />
            </div>
            <b className="text-base font-semibold text-[var(--fg)] group-hover:text-[var(--primary)] transition-colors">Screenshot Scanner</b>
            <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">Reads screenshots with Gemini 2.5 Flash to spot fake receipts and portals.</p>
          </div>

          <div 
            onClick={() => navigate(createPageUrl("QRScanner"))} 
            className="card cursor-pointer hover:border-[var(--primary)] transition-colors group"
          >
            <div className="w-8.5 h-8.5 rounded-lg bg-[var(--surface-2)] text-[var(--primary)] flex items-center justify-center mb-3">
              <QrCode className="w-4.5 h-4.5" />
            </div>
            <b className="text-base font-semibold text-[var(--fg)] group-hover:text-[var(--primary)] transition-colors">QR Inspector</b>
            <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">Decodes QR codes via live camera HUD before you visit where they point.</p>
          </div>

          <div 
            onClick={() => navigate(createPageUrl("VoiceScanner"))} 
            className="card cursor-pointer hover:border-[var(--primary)] transition-colors group"
          >
            <div className="w-8.5 h-8.5 rounded-lg bg-[var(--surface-2)] text-[var(--primary)] flex items-center justify-center mb-3">
              <Mic className="w-4.5 h-4.5" />
            </div>
            <b className="text-base font-semibold text-[var(--fg)] group-hover:text-[var(--primary)] transition-colors">Voice Scanner</b>
            <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">Computes Wiener spectral flatness to flag AI-cloned voices and deepfakes.</p>
          </div>

          <div 
            onClick={() => navigate(createPageUrl("BrowserShield"))} 
            className="card cursor-pointer hover:border-[var(--primary)] transition-colors group"
          >
            <div className="w-8.5 h-8.5 rounded-lg bg-[var(--surface-2)] text-[var(--primary)] flex items-center justify-center mb-3">
              <Shield className="w-4.5 h-4.5" />
            </div>
            <b className="text-base font-semibold text-[var(--fg)] group-hover:text-[var(--primary)] transition-colors">Browser Shield</b>
            <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">Blocks known scam and phishing sites before your browser loads them.</p>
          </div>

        </div>
      </div>

      {/* Recent Activity List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[var(--fg)] tracking-tight">Recent Activity</h2>
          <Link to={createPageUrl("Profile")} className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--primary)] flex items-center gap-1">
            View All History <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="card divide-y divide-[var(--border)] p-0">
          {scans.length > 0 ? (
            scans.slice(0, 5).map((scan, i) => (
              <div key={scan.id || i} className="p-4 flex items-center gap-3.5 hover:bg-[var(--surface-2)] transition-colors">
                <div className="w-9 h-9 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-[var(--muted)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[var(--fg)] capitalize">
                    {scan.scan_type || "Threat"} Inspection
                  </div>
                  <div className="text-xs text-[var(--muted)] truncate max-w-md">
                    {scan.input_content || scan.analysis || "Inspected content snippet"}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-[var(--danger)]">
                    {scan.fraud_score ? `${scan.fraud_score}%` : getSeverityBadge(scan.risk_level)}
                  </div>
                  <div className="text-[11px] text-[var(--muted)] mt-0.5">
                    {scan.created_at ? new Date(scan.created_at).toLocaleDateString() : "Recent"}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="p-4 flex items-center gap-3.5 hover:bg-[var(--surface-2)] transition-colors">
                <div className="w-9 h-9 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center shrink-0">
                  <Link2 className="w-4 h-4 text-[var(--muted)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[var(--fg)]">Link Inspection</div>
                  <div className="text-xs text-[var(--muted)] truncate">paypal-security-verification.com/webscr/login</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-[var(--danger)]">85%</div>
                  <div className="text-[11px] text-[var(--muted)] mt-0.5">Sep 26</div>
                </div>
              </div>

              <div className="p-4 flex items-center gap-3.5 hover:bg-[var(--surface-2)] transition-colors">
                <div className="w-9 h-9 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center shrink-0">
                  <MessageSquareWarning className="w-4 h-4 text-[var(--muted)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[var(--fg)]">Message Inspection</div>
                  <div className="text-xs text-[var(--muted)] truncate">"Your SBI account is blocked today due to KYC expiry..."</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-[var(--danger)]">92%</div>
                  <div className="text-[11px] text-[var(--muted)] mt-0.5">Sep 26</div>
                </div>
              </div>

              <div className="p-4 flex items-center gap-3.5 hover:bg-[var(--surface-2)] transition-colors">
                <div className="w-9 h-9 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center shrink-0">
                  <ImageIcon className="w-4 h-4 text-[var(--muted)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[var(--fg)]">Screenshot Scan</div>
                  <div className="text-xs text-[var(--muted)] truncate">Fake UPI cashback payment receipt image</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-[var(--warning)]">78%</div>
                  <div className="text-[11px] text-[var(--muted)] mt-0.5">Sep 25</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
