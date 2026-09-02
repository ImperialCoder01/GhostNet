import React, { useState } from "react";
import { Lock, ShieldCheck, Trash2, EyeOff, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScannerHeader from "../components/scanner/ScannerHeader";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";

export default function PrivacyCenter() {
  const { user } = useAuth();
  const [clearing, setClearing] = useState(false);
  const [cleared, setCleared] = useState(false);

  const handleClearHistory = async () => {
    if (!user) return;
    setClearing(true);
    try {
      await supabase.from('scan_history').delete().eq('user_id', user.id);
      setCleared(true);
    } catch (e) {
      console.error(e);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-6">
      <ScannerHeader
        icon={Lock}
        title="Privacy & Data Sovereignty Center"
        description="Transparent overview of how your data is evaluated, stored, and protected with zero deceptive practices"
        color="#10b981"
      />

      <div className="ghost-card p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> GhostNet Privacy Guarantees
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="font-bold text-white block">No Ad Tracking or Data Brokering</span>
            <p className="text-slate-400">We do not sell, monetize, or track your browsing habits across third-party networks.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="font-bold text-white block">Serverless Stateless Processing</span>
            <p className="text-slate-400">Scans are evaluated in ephemeral memory on Vercel and sanitized before response delivery.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="font-bold text-white block">PostgreSQL Row-Level Security</span>
            <p className="text-slate-400">All saved scan logs are partitioned by your unique cryptographic user ID via strict RLS.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="font-bold text-white block">Transparent AI Disclosures</span>
            <p className="text-slate-400">Probabilistic AI ratings are clearly stated as probability risk scores, not absolute mathematical truth.</p>
          </div>
        </div>
      </div>

      {/* User Data Controls */}
      <div className="ghost-card p-6 space-y-4 border-rose-500/20">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
          <Trash2 className="w-4 h-4" /> Personal Data Purge
        </h3>
        <p className="text-xs text-slate-300">
          You have full sovereignty over your scan records. Purging will immediately and permanently delete all your past inspection records from the Supabase database.
        </p>

        {cleared ? (
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs font-bold text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Your scan history was permanently wiped.
          </div>
        ) : (
          <Button
            onClick={handleClearHistory}
            disabled={clearing || !user}
            className="text-xs font-bold bg-rose-500 hover:bg-rose-400 text-slate-950 px-4 h-9 rounded-lg">
            {clearing ? "Purging Records..." : "Wipe All My Scan Records"}
          </Button>
        )}
      </div>
    </div>
  );
}
