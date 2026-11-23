import React from 'react';
import { useSelector } from 'react-redux';
import { Database, AlertCircle, CheckCircle, FileSearch } from 'lucide-react';

export default function EvidenceSection() {
  const evidenceAvailable = useSelector((state) => state.investigation.evidence_available);
  const missingEvidence = useSelector((state) => state.investigation.missing_evidence);
  const updatedFields = useSelector((state) => state.investigation.last_updated_fields);
  const isDiffHighlighted = updatedFields.includes('evidence_available') || updatedFields.includes('missing_evidence');

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'High':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'Medium':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default:
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div
      className={`rounded-xl border bg-slate-900/60 p-4 transition-all duration-500 ${
        isDiffHighlighted
          ? 'border-cyan-400 ring-2 ring-cyan-500/20 shadow-lg shadow-cyan-500/10'
          : 'border-slate-800'
      }`}
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            3. Evidence Log & Information Gaps
          </h2>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          {evidenceAvailable.length} Logged | {missingEvidence.length} Gaps Pending
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Evidence Available */}
        <div>
          <h3 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Available Evidence (Corroborated)</span>
          </h3>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {evidenceAvailable.length === 0 ? (
              <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 text-center text-slate-500 text-xs">
                No verified evidence logged yet. Paste incident report or upload document.
              </div>
            ) : (
              evidenceAvailable.map((ev) => (
                <div
                  key={ev.id}
                  className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-cyan-400 font-semibold">{ev.id}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {ev.category || 'General'}
                    </span>
                  </div>
                  <p className="text-slate-200 font-medium">{ev.description}</p>
                  <p className="text-[11px] text-slate-400 italic">Source: {ev.source}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Missing Evidence / Information Gaps */}
        <div>
          <h3 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Missing Evidence / Regulatory Gaps (ICH Q7)</span>
          </h3>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {missingEvidence.length === 0 ? (
              <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 text-center text-slate-500 text-xs">
                No critical evidence gaps flagged. Ask AI Copilot: "Find missing evidence".
              </div>
            ) : (
              missingEvidence.map((gap) => (
                <div
                  key={gap.id}
                  className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-amber-400 font-semibold">{gap.id}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${getPriorityBadge(
                        gap.priority
                      )}`}
                    >
                      Priority: {gap.priority}
                    </span>
                  </div>
                  <p className="text-slate-200 font-medium">{gap.gap}</p>
                  <p className="text-[11px] text-slate-400">
                    <strong className="text-slate-300">Why Required: </strong>
                    {gap.why_needed}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
