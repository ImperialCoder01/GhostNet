import React, { useState } from "react";
import { 
  Building2, Zap, Shield, Users, Cpu, ArrowUpRight, CheckCircle2, 
  DollarSign, Activity, Lock, Globe, Server, Layers, BarChart3, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BusinessModel() {
  const [activeTab, setActiveTab] = useState("pricing");
  const [billingCycle, setBillingCycle] = useState("monthly"); // monthly vs annual

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex gap-3.5 items-start">
        <div className="w-11.5 h-11.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center shrink-0 text-[var(--primary)]">
          <Building2 className="w-5.5 h-5.5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Business Model & Monetization
          </h1>
          <p className="text-[var(--muted)] text-sm mt-1 max-w-2xl">
            Product-Led Growth (PLG) architecture, ultra-low infrastructure unit economics (~90.7% gross margin), and multi-tier B2C/B2B monetization engine.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metric">
          <div className="flex items-center justify-between text-xs text-[var(--muted)] font-medium mb-1">
            Blended COGS / Scan
            <div className="w-7 h-7 rounded-lg bg-[var(--surface-2)] flex items-center justify-center text-[var(--primary)]">
              <Cpu className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[var(--fg)]">$0.000125</div>
          <p className="text-[11px] text-[var(--success)] font-medium mt-1">Groq LPU + On-device DSP</p>
        </div>

        <div className="metric">
          <div className="flex items-center justify-between text-xs text-[var(--muted)] font-medium mb-1">
            Gross Margin
            <div className="w-7 h-7 rounded-lg bg-[var(--success-bg)] flex items-center justify-center text-[var(--success)]">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[var(--success)]">90.7%</div>
          <p className="text-[11px] text-[var(--muted)] font-medium mt-1">$4.53 net on $4.99 Pro tier</p>
        </div>

        <div className="metric">
          <div className="flex items-center justify-between text-xs text-[var(--muted)] font-medium mb-1">
            B2B API Price
            <div className="w-7 h-7 rounded-lg bg-[var(--surface-2)] flex items-center justify-center text-[var(--secondary)]">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[var(--fg)]">$0.005</div>
          <p className="text-[11px] text-[var(--muted)] font-medium mt-1">Per FinTech verification call</p>
        </div>

        <div className="metric">
          <div className="flex items-center justify-between text-xs text-[var(--muted)] font-medium mb-1">
            Year 3 ARR Target
            <div className="w-7 h-7 rounded-lg bg-[var(--warning-bg)] flex items-center justify-center text-[var(--warning)]">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[var(--warning)]">$13.4M</div>
          <p className="text-[11px] text-[var(--muted)] font-medium mt-1">3.2M registered active users</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl">
        <button
          onClick={() => setActiveTab("pricing")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "pricing" 
              ? "bg-[var(--primary)] text-[var(--primary-fg)] shadow-sm" 
              : "text-[var(--muted)] hover:text-[var(--fg)]"
          }`}
        >
          <DollarSign className="w-4 h-4" /> Pricing & Subscription Tiers
        </button>
        <button
          onClick={() => setActiveTab("unit-economics")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "unit-economics" 
              ? "bg-[var(--primary)] text-[var(--primary-fg)] shadow-sm" 
              : "text-[var(--muted)] hover:text-[var(--fg)]"
          }`}
        >
          <Cpu className="w-4 h-4" /> Unit Economics & COGS
        </button>
        <button
          onClick={() => setActiveTab("flywheel")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "flywheel" 
              ? "bg-[var(--primary)] text-[var(--primary-fg)] shadow-sm" 
              : "text-[var(--muted)] hover:text-[var(--fg)]"
          }`}
        >
          <Layers className="w-4 h-4" /> Growth Flywheel & Projections
        </button>
      </div>

      {/* Tab 1: Pricing & Subscription Tiers */}
      {activeTab === "pricing" && (
        <div className="space-y-6">
          {/* Billing Cycle Switch */}
          <div className="flex justify-center items-center gap-3">
            <span className={`text-xs font-semibold ${billingCycle === "monthly" ? "text-[var(--fg)]" : "text-[var(--muted)]"}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setBillingCycle(prev => prev === "monthly" ? "annual" : "monthly")}
              className="w-12 h-6 rounded-full bg-[var(--surface-2)] border border-[var(--border)] p-0.5 relative transition-colors"
            >
              <div className={`w-4.5 h-4.5 rounded-full bg-[var(--primary)] transition-transform ${billingCycle === "annual" ? "translate-x-6" : "translate-x-0"}`} />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1 ${billingCycle === "annual" ? "text-[var(--fg)]" : "text-[var(--muted)]"}`}>
              Annual Billing <span className="text-[10px] bg-[var(--success-bg)] text-[var(--success)] px-1.5 py-0.5 rounded-full font-bold">Save 20%</span>
            </span>
          </div>

          {/* Pricing Grid */}
          <div className="grid md:grid-cols-3 gap-5">
            
            {/* Free Tier */}
            <div className="card flex flex-col justify-between relative">
              <div>
                <span className="badge badge-safe mb-3">Community Shield</span>
                <h3 className="text-xl font-bold text-[var(--fg)]">GhostNet Free</h3>
                <p className="text-xs text-[var(--muted)] mt-1">Product-Led Growth top-of-funnel consumer shield.</p>
                
                <div className="my-5">
                  <span className="text-3xl font-extrabold text-[var(--fg)]">$0</span>
                  <span className="text-xs text-[var(--muted)]"> / forever</span>
                </div>

                <ul className="space-y-2.5 text-xs text-[var(--fg)] mb-6">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" /> Unlimited Text & Link Inspections</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" /> Manifest V3 Browser Shield</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" /> Global Threat Intelligence Radar</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" /> Deterministic Heuristic Engine</li>
                </ul>
              </div>
              <Button variant="outline" className="w-full border-[var(--border)] bg-[var(--surface-2)]">Active Plan</Button>
            </div>

            {/* Pro Tier (Popular) */}
            <div className="card flex flex-col justify-between relative border-[var(--primary)] bg-[var(--surface-2)] shadow-lg">
              <div className="absolute -top-3 right-4 bg-[var(--primary)] text-[var(--primary-fg)] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Most Popular
              </div>
              <div>
                <span className="badge badge-medium mb-3">Individual Pro</span>
                <h3 className="text-xl font-bold text-[var(--fg)]">GhostNet Pro</h3>
                <p className="text-xs text-[var(--muted)] mt-1">Full AI multi-modal protection across all 5 vectors.</p>
                
                <div className="my-5">
                  <span className="text-3xl font-extrabold text-[var(--primary)]">
                    {billingCycle === "annual" ? "$4.08" : "$4.99"}
                  </span>
                  <span className="text-xs text-[var(--muted)]"> / month</span>
                </div>

                <ul className="space-y-2.5 text-xs text-[var(--fg)] mb-6">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--primary)] shrink-0" /> Everything in Free Tier</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--primary)] shrink-0" /> Voice Deepfake & Audio Analyzer</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--primary)] shrink-0" /> Real-Time Live Camera QR HUD</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--primary)] shrink-0" /> Gemini 2.5 Flash Vision Screenshot OCR</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--primary)] shrink-0" /> Sub-Second Groq LPU Inference</li>
                </ul>
              </div>
              <Button className="w-full bg-[var(--primary)] text-[var(--primary-fg)] font-bold">Upgrade to Pro</Button>
            </div>

            {/* Enterprise / B2B API */}
            <div className="card flex flex-col justify-between relative">
              <div>
                <span className="badge badge-high mb-3">B2B Fraud-as-a-Service</span>
                <h3 className="text-xl font-bold text-[var(--fg)]">FinTech & Enterprise API</h3>
                <p className="text-xs text-[var(--muted)] mt-1">Pre-transaction fraud scanning for banks & neobanks.</p>
                
                <div className="my-5">
                  <span className="text-3xl font-extrabold text-[var(--fg)]">$0.005</span>
                  <span className="text-xs text-[var(--muted)]"> / verification call</span>
                </div>

                <ul className="space-y-2.5 text-xs text-[var(--fg)] mb-6">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--secondary)] shrink-0" /> Low-Latency Edge API (&lt;25ms)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--secondary)] shrink-0" /> Pre-Payment Beneficiary Verification</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--secondary)] shrink-0" /> Corporate Browser Shield MDM Deployment</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--secondary)] shrink-0" /> Custom Threat Telemetry Webhooks</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--secondary)] shrink-0" /> 99.95% SLA & Dedicated Support</li>
                </ul>
              </div>
              <Button variant="outline" className="w-full border-[var(--border)] bg-[var(--surface-2)]">Contact Enterprise Sales</Button>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: Unit Economics & COGS */}
      {activeTab === "unit-economics" && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-base font-bold text-[var(--fg)] mb-2">Cost of Goods Sold (COGS) Breakdown</h3>
            <p className="text-xs text-[var(--muted)] mb-4">
              By combining client-side digital signal processing (Web Audio API Wiener Flatness) with ultra-fast Groq LPUs, GhostNet achieves an industry-leading ~90.7% gross margin.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] font-semibold text-[var(--muted)] uppercase border-b border-[var(--border)]">
                  <tr>
                    <th className="py-2.5 px-3">Modality</th>
                    <th className="py-2.5 px-3">Primary Engine</th>
                    <th className="py-2.5 px-3">Provider</th>
                    <th className="py-2.5 px-3">Average Latency</th>
                    <th className="py-2.5 px-3">Cost / 1,000 Scans</th>
                    <th className="py-2.5 px-3 text-right">Cost / Single Scan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] font-medium text-[var(--fg)]">
                  <tr>
                    <td className="py-3 px-3 font-semibold">SMS / Text Message</td>
                    <td className="py-3 px-3">Groq LPU (llama-3.3-70b)</td>
                    <td className="py-3 px-3">Groq Inc.</td>
                    <td className="py-3 px-3">620 ms</td>
                    <td className="py-3 px-3">$0.10</td>
                    <td className="py-3 px-3 text-right font-mono text-[var(--primary)]">$0.000100</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold">URL / Typosquatting</td>
                    <td className="py-3 px-3">Client Entropy + Supabase DB</td>
                    <td className="py-3 px-3">Supabase Edge</td>
                    <td className="py-3 px-3">120 ms</td>
                    <td className="py-3 px-3">$0.02</td>
                    <td className="py-3 px-3 text-right font-mono text-[var(--primary)]">$0.000020</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold">Screenshot OCR</td>
                    <td className="py-3 px-3">Gemini 2.5 Flash Vision</td>
                    <td className="py-3 px-3">Google Cloud</td>
                    <td className="py-3 px-3">950 ms</td>
                    <td className="py-3 px-3">$0.25</td>
                    <td className="py-3 px-3 text-right font-mono text-[var(--primary)]">$0.000250</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold">Live Camera QR</td>
                    <td className="py-3 px-3">jsQR Canvas Decoder</td>
                    <td className="py-3 px-3">Client Device ($0)</td>
                    <td className="py-3 px-3">40 ms</td>
                    <td className="py-3 px-3">$0.02</td>
                    <td className="py-3 px-3 text-right font-mono text-[var(--primary)]">$0.000020</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold">Voice Deepfake Audio</td>
                    <td className="py-3 px-3">Acoustic FFT + Groq Whisper</td>
                    <td className="py-3 px-3">Client DSP + Groq</td>
                    <td className="py-3 px-3">1100 ms</td>
                    <td className="py-3 px-3">$0.15</td>
                    <td className="py-3 px-3 text-right font-mono text-[var(--primary)]">$0.000150</td>
                  </tr>
                  <tr className="bg-[var(--surface-2)] font-bold">
                    <td className="py-3 px-3" colSpan={4}>Blended Average Cost per User Scan</td>
                    <td className="py-3 px-3">$0.125</td>
                    <td className="py-3 px-3 text-right font-mono text-[var(--success)]">$0.000125</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Flywheel & Projections */}
      {activeTab === "flywheel" && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-base font-bold text-[var(--fg)] mb-2">Growth & Telemetry Flywheel</h3>
            <p className="text-xs text-[var(--muted)] mb-4">
              How consumer adoption generates real-time threat intelligence data, creating an unbeatable moat for enterprise B2B sales.
            </p>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <span className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider block mb-1">Step 1</span>
                <h4 className="text-sm font-bold text-[var(--fg)]">Viral Consumer PLG</h4>
                <p className="text-xs text-[var(--muted)] mt-1">Free scanner drives rapid adoption across SMS, web, and mobile.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <span className="text-[10px] font-bold text-[var(--secondary)] uppercase tracking-wider block mb-1">Step 2</span>
                <h4 className="text-sm font-bold text-[var(--fg)]">Crowd Telemetry</h4>
                <p className="text-xs text-[var(--muted)] mt-1">User scans generate SHA-256 indicator hashes in Supabase RLS.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <span className="text-[10px] font-bold text-[var(--success)] uppercase tracking-wider block mb-1">Step 3</span>
                <h4 className="text-sm font-bold text-[var(--fg)]">Defensive Data Moat</h4>
                <p className="text-xs text-[var(--muted)] mt-1">Expanding active threat list improves accuracy for all users.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <span className="text-[10px] font-bold text-[var(--warning)] uppercase tracking-wider block mb-1">Step 4</span>
                <h4 className="text-sm font-bold text-[var(--fg)]">B2B API Conversion</h4>
                <p className="text-xs text-[var(--muted)] mt-1">FinTechs buy API access to scan transactions against our database.</p>
              </div>
            </div>
          </div>

          {/* 3-Year Projections */}
          <div className="card">
            <h3 className="text-base font-bold text-[var(--fg)] mb-3">3-Year Financial Projections</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] font-semibold text-[var(--muted)] uppercase border-b border-[var(--border)]">
                  <tr>
                    <th className="py-2.5 px-3">Metric</th>
                    <th className="py-2.5 px-3">Year 1</th>
                    <th className="py-2.5 px-3">Year 2</th>
                    <th className="py-2.5 px-3 text-right">Year 3</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] font-medium text-[var(--fg)]">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">Registered Active Users</td>
                    <td className="py-2.5 px-3">120,000</td>
                    <td className="py-2.5 px-3">850,000</td>
                    <td className="py-2.5 px-3 text-right font-bold">3,200,000</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">B2C Pro Subscribers (4% conv.)</td>
                    <td className="py-2.5 px-3">4,800</td>
                    <td className="py-2.5 px-3">38,250</td>
                    <td className="py-2.5 px-3 text-right font-bold">160,000</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">B2C Subscription ARR</td>
                    <td className="py-2.5 px-3">$235,000</td>
                    <td className="py-2.5 px-3">$1,874,000</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[var(--primary)]">$7,840,000</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">B2B API & Enterprise ARR</td>
                    <td className="py-2.5 px-3">$180,000</td>
                    <td className="py-2.5 px-3">$1,250,000</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[var(--secondary)]">$5,600,000</td>
                  </tr>
                  <tr className="bg-[var(--surface-2)] font-extrabold text-[var(--success)]">
                    <td className="py-3 px-3">Total Annual Recurring Revenue (ARR)</td>
                    <td className="py-3 px-3">$415,000</td>
                    <td className="py-3 px-3">$3,124,000</td>
                    <td className="py-3 px-3 text-right font-mono text-sm">$13,440,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
