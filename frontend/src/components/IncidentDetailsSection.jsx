import React from 'react';
import { useSelector } from 'react-redux';
import { FileText, Tag, AlertTriangle, Cpu, Calendar, User, MapPin, Activity } from 'lucide-react';

export default function IncidentDetailsSection() {
  const incident = useSelector((state) => state.investigation.incident_details);
  const updatedFields = useSelector((state) => state.investigation.last_updated_fields);
  const isDiffHighlighted = updatedFields.includes('incident_details');

  const severityBadge = (sev) => {
    switch (sev) {
      case 'Critical':
        return 'bg-rose-500/15 border-rose-500/40 text-rose-400';
      case 'Minor':
        return 'bg-blue-500/15 border-blue-500/40 text-blue-400';
      default:
        return 'bg-amber-500/15 border-amber-500/40 text-amber-400';
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
          <FileText className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            1. Incident & Deviation Identification
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">ID:</span>
          <span className="font-mono text-xs font-semibold text-cyan-300 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
            {incident.incident_id || 'PENDING-INTAKE'}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded border ${severityBadge(
              incident.severity
            )}`}
          >
            {incident.severity || 'Major'}
          </span>
        </div>
      </div>

      {/* Grid of Read-Only Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        {/* Title */}
        <div className="col-span-full">
          <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1">
            <Tag className="w-3 h-3 text-slate-500" /> Incident Title
          </label>
          <input
            type="text"
            readOnly
            disabled
            value={incident.title || ''}
            placeholder="Awaiting AI extraction from document or prompt..."
            className="w-full bg-slate-950/70 border border-slate-800 rounded-md px-2.5 py-1.5 text-slate-200 font-medium cursor-not-allowed select-text placeholder:text-slate-600"
          />
        </div>

        {/* Product / Intermediate */}
        <div>
          <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1">
            Product / Intermediate (API)
          </label>
          <input
            type="text"
            readOnly
            disabled
            value={incident.product_intermediate || ''}
            placeholder="e.g. Atorvastatin Calcium Trihydrate"
            className="w-full bg-slate-950/70 border border-slate-800 rounded-md px-2.5 py-1.5 text-slate-200 cursor-not-allowed select-text placeholder:text-slate-600"
          />
        </div>

        {/* Batch / Lot No */}
        <div>
          <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1">
            Batch / Lot Number
          </label>
          <input
            type="text"
            readOnly
            disabled
            value={incident.batch_lot_no || ''}
            placeholder="e.g. ATC-26-088"
            className="w-full font-mono bg-slate-950/70 border border-slate-800 rounded-md px-2.5 py-1.5 text-cyan-300 font-medium cursor-not-allowed select-text placeholder:text-slate-600"
          />
        </div>

        {/* Process Stage */}
        <div>
          <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1">
            Process Stage
          </label>
          <input
            type="text"
            readOnly
            disabled
            value={incident.process_stage || ''}
            placeholder="e.g. Crystallization & Isolation"
            className="w-full bg-slate-950/70 border border-slate-800 rounded-md px-2.5 py-1.5 text-slate-200 cursor-not-allowed select-text placeholder:text-slate-600"
          />
        </div>

        {/* Equipment ID */}
        <div>
          <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1">
            <Cpu className="w-3 h-3 text-slate-500" /> Equipment ID / Tag
          </label>
          <input
            type="text"
            readOnly
            disabled
            value={incident.equipment_id || ''}
            placeholder="e.g. CR-104 / CU-02"
            className="w-full font-mono bg-slate-950/70 border border-slate-800 rounded-md px-2.5 py-1.5 text-slate-200 cursor-not-allowed select-text placeholder:text-slate-600"
          />
        </div>

        {/* Date / Time */}
        <div>
          <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1">
            <Calendar className="w-3 h-3 text-slate-500" /> Date / Time of Occurrence
          </label>
          <input
            type="text"
            readOnly
            disabled
            value={incident.date_time_occurrence || ''}
            placeholder="e.g. 2026-10-14 06:30 IST"
            className="w-full bg-slate-950/70 border border-slate-800 rounded-md px-2.5 py-1.5 text-slate-200 cursor-not-allowed select-text placeholder:text-slate-600"
          />
        </div>

        {/* Reported By */}
        <div>
          <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1">
            <User className="w-3 h-3 text-slate-500" /> Reported By
          </label>
          <input
            type="text"
            readOnly
            disabled
            value={incident.reported_by || ''}
            placeholder="e.g. Dr. Rajesh Sharma"
            className="w-full bg-slate-950/70 border border-slate-800 rounded-md px-2.5 py-1.5 text-slate-200 cursor-not-allowed select-text placeholder:text-slate-600"
          />
        </div>

        {/* Area / Department */}
        <div className="col-span-full md:col-span-2">
          <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1">
            <MapPin className="w-3 h-3 text-slate-500" /> Manufacturing Area / Department
          </label>
          <input
            type="text"
            readOnly
            disabled
            value={incident.area_department || ''}
            placeholder="e.g. API Production Block 4 / Synthesis"
            className="w-full bg-slate-950/70 border border-slate-800 rounded-md px-2.5 py-1.5 text-slate-200 cursor-not-allowed select-text placeholder:text-slate-600"
          />
        </div>

        {/* Description */}
        <div className="col-span-full">
          <label className="text-[11px] font-medium text-slate-400 mb-1 block">
            Incident Description & Deviation Narrative
          </label>
          <textarea
            readOnly
            disabled
            rows={3}
            value={incident.description || ''}
            placeholder="Detailed narrative of temperature spike, OOS result, yield drop, or equipment malfunction..."
            className="w-full bg-slate-950/70 border border-slate-800 rounded-md px-2.5 py-1.5 text-slate-300 resize-none cursor-not-allowed select-text placeholder:text-slate-600 leading-relaxed font-sans"
          />
        </div>

        {/* Immediate Action Taken */}
        <div className="col-span-full md:col-span-1">
          <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1">
            <Activity className="w-3 h-3 text-amber-400" /> Immediate Containment Action
          </label>
          <textarea
            readOnly
            disabled
            rows={2}
            value={incident.immediate_action_taken || ''}
            placeholder="Material quarantine, equipment isolation, QA notification..."
            className="w-full bg-slate-950/70 border border-slate-800 rounded-md px-2.5 py-1.5 text-slate-300 resize-none cursor-not-allowed select-text placeholder:text-slate-600"
          />
        </div>

        {/* Impact Assessment */}
        <div className="col-span-full md:col-span-2">
          <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1">
            <AlertTriangle className="w-3 h-3 text-rose-400" /> Initial Impact Assessment
          </label>
          <textarea
            readOnly
            disabled
            rows={2}
            value={incident.impact_assessment || ''}
            placeholder="Impact on Critical Quality Attributes (CQA), batch release risk..."
            className="w-full bg-slate-950/70 border border-slate-800 rounded-md px-2.5 py-1.5 text-slate-300 resize-none cursor-not-allowed select-text placeholder:text-slate-600"
          />
        </div>
      </div>
    </div>
  );
}
