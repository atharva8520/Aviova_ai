import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateCapaStatus } from '../store/investigationSlice';
import { ShieldCheck, Check, X, Clock, User, Link2 } from 'lucide-react';

export default function CapaTable() {
  const dispatch = useDispatch();
  const capas = useSelector((state) => state.investigation.capa_recommendations);
  const updatedFields = useSelector((state) => state.investigation.last_updated_fields);
  const isDiffHighlighted = updatedFields.includes('capa_recommendations');

  const getTypeBadge = (t) => {
    switch (t) {
      case 'Correction':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'Preventive Action':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
    }
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case 'Accepted':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Accepted
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            Suggested
          </span>
        );
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
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            6. Corrective & Preventive Action (CAPA) Plan
          </h2>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          ICH Q10 Lifecycle Tracking ({capas.length} Actions)
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
              <th className="py-2.5 px-3">ID</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3 min-w-[220px]">Action Plan</th>
              <th className="py-2.5 px-3 min-w-[180px]">Rationale</th>
              <th className="py-2.5 px-3">Linked RC</th>
              <th className="py-2.5 px-3">Owner Role</th>
              <th className="py-2.5 px-3">Due Window</th>
              <th className="py-2.5 px-3 min-w-[180px]">Effectiveness Check</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
            {capas.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-6 text-center text-slate-500">
                  No CAPA recommendations generated yet. Ask AI Copilot: "Suggest CAPA".
                </td>
              </tr>
            ) : (
              capas.map((capa) => (
                <tr key={capa.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-2.5 px-3 font-mono font-semibold text-cyan-400">{capa.id}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getTypeBadge(capa.type)}`}>
                      {capa.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-200">{capa.action}</td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px] leading-relaxed">{capa.rationale}</td>
                  <td className="py-2.5 px-3 font-mono text-cyan-400">
                    <span className="flex items-center gap-1">
                      <Link2 className="w-3 h-3 text-slate-500" />
                      {capa.linked_root_cause}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-500" />
                      {capa.owner_role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {capa.due_window}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px] leading-relaxed">
                    {capa.effectiveness_check}
                  </td>
                  <td className="py-2.5 px-3">{getStatusBadge(capa.status)}</td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => dispatch(updateCapaStatus({ id: capa.id, status: 'Accepted' }))}
                        disabled={capa.status === 'Accepted'}
                        className={`p-1.5 rounded transition ${
                          capa.status === 'Accepted'
                            ? 'bg-emerald-950 text-emerald-400 opacity-50 cursor-default'
                            : 'bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white'
                        }`}
                        title="Accept CAPA"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => dispatch(updateCapaStatus({ id: capa.id, status: 'Rejected' }))}
                        disabled={capa.status === 'Rejected'}
                        className={`p-1.5 rounded transition ${
                          capa.status === 'Rejected'
                            ? 'bg-rose-950 text-rose-400 opacity-50 cursor-default'
                            : 'bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white'
                        }`}
                        title="Reject CAPA"
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
    </div>
  );
}
