import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateRootCauseStatus } from '../store/investigationSlice';
import { 
  Target, 
  Check, 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  UserCheck, 
  Info 
} from 'lucide-react';

export default function RootCauseTable() {
  const dispatch = useDispatch();
  const candidates = useSelector((state) => state.investigation.root_cause_candidates);
  const updatedFields = useSelector((state) => state.investigation.last_updated_fields);
  const isDiffHighlighted = updatedFields.includes('root_cause_candidates');

  // Confirmation Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCauseId, setSelectedCauseId] = useState(null);
  const [confirmerName, setConfirmerName] = useState('Dr. K. Rao (QA Qualified Person)');

  const handleOpenConfirmModal = (id) => {
    setSelectedCauseId(id);
    setModalOpen(true);
  };

  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    if (!confirmerName.trim() || !selectedCauseId) return;

    dispatch(
      updateRootCauseStatus({
        id: selectedCauseId,
        status: 'Confirmed',
        confirmed_by: confirmerName.trim(),
        confirmed_at: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      })
    );
    setModalOpen(false);
  };

  const handleReject = (id) => {
    dispatch(
      updateRootCauseStatus({
        id,
        status: 'Rejected',
      })
    );
  };

  const getStatusBadge = (rc) => {
    switch (rc.status) {
      case 'Confirmed':
        return (
          <div className="flex flex-col items-start gap-0.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <UserCheck className="w-3 h-3" /> Confirmed
            </span>
            {rc.confirmed_by && (
              <span className="text-[10px] text-emerald-300 font-mono">
                by {rc.confirmed_by}
              </span>
            )}
          </div>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <X className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <Info className="w-3 h-3" /> AI Suggested
          </span>
        );
    }
  };

  const getLikelihoodBadge = (l) => {
    switch (l) {
      case 'High':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'Low':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
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
          <Target className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            5. Root Cause Candidates & Review
          </h2>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          {candidates.length} Candidate Causes
        </span>
      </div>

      {/* Mandatory GMP Regulatory Notice */}
      <div className="bg-amber-950/40 border border-amber-500/30 rounded-lg p-2.5 mb-3 flex items-start gap-2 text-xs text-amber-200/90 leading-relaxed">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-amber-300">ICH Q9 / 21 CFR 211.192 Compliance Notice: </strong>
          AI-generated root causes are suggestions until supported by objective evidence and confirmed by a qualified person (QA/QP sign-off).
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
              <th className="py-2.5 px-3">ID</th>
              <th className="py-2.5 px-3 min-w-[200px]">Candidate Root Cause</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Likelihood</th>
              <th className="py-2.5 px-3 min-w-[180px]">Supporting Evidence</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Review Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
            {candidates.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-slate-500">
                  No root cause candidates evaluated yet. Trigger "Run RCA" via the Copilot on the right.
                </td>
              </tr>
            ) : (
              candidates.map((rc) => (
                <tr key={rc.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-2.5 px-3 font-mono font-semibold text-cyan-400">{rc.id}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-200">{rc.cause}</td>
                  <td className="py-2.5 px-3 text-slate-400">{rc.category}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        rc.classification === 'Probable Root Cause'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {rc.classification}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${getLikelihoodBadge(rc.likelihood)}`}>
                      {rc.likelihood}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px] leading-relaxed">
                    {rc.supporting_evidence}
                  </td>
                  <td className="py-2.5 px-3">{getStatusBadge(rc)}</td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenConfirmModal(rc.id)}
                        disabled={rc.status === 'Confirmed'}
                        className={`p-1.5 rounded transition ${
                          rc.status === 'Confirmed'
                            ? 'bg-emerald-950 text-emerald-400 opacity-50 cursor-default'
                            : 'bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white'
                        }`}
                        title="Confirm root cause (QA Qualified Person Sign-off)"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleReject(rc.id)}
                        disabled={rc.status === 'Rejected'}
                        className={`p-1.5 rounded transition ${
                          rc.status === 'Rejected'
                            ? 'bg-rose-950 text-rose-400 opacity-50 cursor-default'
                            : 'bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white'
                        }`}
                        title="Reject candidate cause"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-5 shadow-2xl">
            <div className="flex items-center gap-2 mb-3 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-semibold text-sm text-slate-100">Confirm Root Cause (QP Sign-off)</h3>
            </div>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Confirming candidate <strong className="text-cyan-400 font-mono">{selectedCauseId}</strong> validates that supporting evidence meets GMP regulatory standards. Please enter the name and role of the Qualified Person.
            </p>
            <form onSubmit={handleConfirmSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  Confirmed By (Qualified Person / Lead Investigator):
                </label>
                <input
                  type="text"
                  required
                  value={confirmerName}
                  onChange={(e) => setConfirmerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium"
                >
                  Confirm Root Cause
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
