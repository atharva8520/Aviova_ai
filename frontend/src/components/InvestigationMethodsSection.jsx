import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from '../store/investigationSlice';
import { GitCommit, Fish, HelpCircle, CheckCircle, ArrowDown } from 'lucide-react';
import FishboneDiagram from './FishboneDiagram';

export default function InvestigationMethodsSection() {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.investigation.active_tab);
  const fiveWhys = useSelector((state) => state.investigation.five_whys);
  const updatedFields = useSelector((state) => state.investigation.last_updated_fields);
  const isDiffHighlighted = updatedFields.includes('five_whys') || updatedFields.includes('fishbone');

  const getConfidenceBadge = (conf) => {
    switch (conf) {
      case 'High':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Low':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
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
          <GitCommit className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            4. Investigation Method: 5 Whys & Fishbone
          </h2>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => dispatch(setActiveTab('5whys'))}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition ${
              activeTab === '5whys'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>5 Whys Chain ({fiveWhys.length})</span>
          </button>
          <button
            onClick={() => dispatch(setActiveTab('fishbone'))}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition ${
              activeTab === 'fishbone'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Fish className="w-3.5 h-3.5" />
            <span>Fishbone (6M Ishikawa)</span>
          </button>
        </div>
      </div>

      {activeTab === '5whys' ? (
        /* 5 Whys Step Ladder */
        <div className="space-y-3">
          {fiveWhys.length === 0 ? (
            <div className="p-6 rounded-lg bg-slate-950/60 border border-slate-800 text-center text-slate-500 text-xs">
              No 5 Whys analysis performed yet. Click "Run RCA" in the Copilot panel on the right.
            </div>
          ) : (
            fiveWhys.map((w, idx) => (
              <div key={w.step} className="relative">
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 flex flex-col gap-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold font-mono flex items-center justify-center text-[10px]">
                        {w.step}
                      </span>
                      <span className="font-semibold text-slate-200">Why #{w.step}: {w.question}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getConfidenceBadge(
                        w.confidence
                      )}`}
                    >
                      Confidence: {w.confidence}
                    </span>
                  </div>

                  <p className="text-slate-300 pl-7 font-sans leading-relaxed">
                    <strong className="text-cyan-400">Answer: </strong> {w.answer}
                  </p>

                  {w.evidence && (
                    <p className="text-[11px] text-slate-400 pl-7 italic">
                      <strong className="text-slate-300">Supporting Evidence: </strong> {w.evidence}
                    </p>
                  )}
                </div>

                {idx < fiveWhys.length - 1 && (
                  <div className="flex justify-center my-1">
                    <ArrowDown className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <FishboneDiagram />
      )}
    </div>
  );
}
