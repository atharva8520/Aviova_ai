import React from 'react';
import { useSelector } from 'react-redux';
import { ShieldAlert, ArrowRightCircle, Sparkles, BookOpen } from 'lucide-react';

export default function RiskAssessmentSection() {
  const risk = useSelector((state) => state.investigation.risk_assessment);
  const updatedFields = useSelector((state) => state.investigation.last_updated_fields);
  const isDiffHighlighted = updatedFields.includes('risk_assessment');

  const getSeverityColor = (sev) => {
    switch (sev) {
      case 'Critical':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'Minor':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default:
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
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
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            2. AI Copilot Risk Assessment & Disposition
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
          <Sparkles className="w-3 h-3" />
          <span>ICH Q9 Risk Model</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* Severity & Disposition */}
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-medium text-slate-400 mb-1 block">Severity Rating</label>
            <div className={`px-2.5 py-1.5 rounded-md border font-semibold ${getSeverityColor(risk.severity)}`}>
              {risk.severity || 'Major'}
            </div>
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-400 mb-1 block">
              Batch Disposition Recommendation
            </label>
            <div className="px-2.5 py-1.5 rounded-md bg-slate-950/70 border border-slate-800 text-slate-200 font-medium">
              {risk.batch_disposition || 'Quarantine / Hold (Tamper-evident seal applied)'}
            </div>
          </div>
        </div>

        {/* Product / Patient Impact */}
        <div className="md:col-span-2 space-y-3">
          <div>
            <label className="text-[11px] font-medium text-slate-400 mb-1 block">
              Product & Patient Impact (CQA Assessment)
            </label>
            <textarea
              readOnly
              disabled
              rows={2}
              value={risk.product_patient_impact || ''}
              placeholder="Analysis of impact on API purity, bioavailability, safety..."
              className="w-full bg-slate-950/70 border border-slate-800 rounded-md px-2.5 py-1.5 text-slate-300 resize-none cursor-not-allowed select-text placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1">
              <ArrowRightCircle className="w-3.5 h-3.5 text-cyan-400" /> Next Recommended Action
            </label>
            <div className="px-2.5 py-1.5 rounded-md bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 font-medium">
              {risk.next_recommended_action || 'Execute 5 Whys Root Cause Analysis and verify equipment calibration records.'}
            </div>
          </div>
        </div>

        {/* Technical Reasoning */}
        <div className="col-span-full">
          <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1">
            <BookOpen className="w-3.5 h-3.5 text-slate-500" /> Regulatory & Technical Reasoning (ICH Q7 / 21 CFR 211.192)
          </label>
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-md p-2.5 text-slate-300 leading-relaxed font-sans text-xs">
            {risk.reasoning || 'Under 21 CFR 211.192, any unexplained discrepancy or failure of a batch to meet specifications must be investigated thoroughly. Awaiting AI assessment.'}
          </div>
        </div>
      </div>
    </div>
  );
}
