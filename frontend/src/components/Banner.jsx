import React from 'react';
import { Lock, Sparkles, ShieldCheck } from 'lucide-react';

export default function Banner() {
  return (
    <div className="bg-slate-900/90 border border-cyan-500/30 rounded-lg p-2.5 mb-4 flex items-center justify-between text-xs text-slate-300 shadow-sm backdrop-blur">
      <div className="flex items-center gap-2">
        <div className="p-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400">
          <Lock className="w-3.5 h-3.5" />
        </div>
        <div>
          <span className="font-semibold text-cyan-300 uppercase tracking-wide">Read-Only Form: </span>
          <span className="text-slate-300">
            Direct manual typing is disabled. All parameters are populated and revised programmatically via the AI Copilot.
          </span>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-[11px]">
        <Sparkles className="w-3 h-3 text-cyan-400" />
        <span>ICH Q7 / 21 CFR 211.192</span>
      </div>
    </div>
  );
}
