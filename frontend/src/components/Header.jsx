import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Save, 
  PlusCircle, 
  Download, 
  FolderOpen, 
  CheckCircle2, 
  AlertCircle,
  FlaskConical,
  Clock
} from 'lucide-react';
import { 
  resetInvestigation, 
  setToast, 
  setActiveInvestigationId,
  setFullState 
} from '../store/investigationSlice';
import SavedDrawer from './SavedDrawer';

export default function Header() {
  const dispatch = useDispatch();
  const investigation = useSelector((state) => state.investigation);
  const { has_extracted, incident_details, active_investigation_id, status } = investigation;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!has_extracted) return;
    setSaving(true);
    try {
      const payload = {
        id: active_investigation_id || undefined,
        title: incident_details.title || 'Untitled RCA Investigation',
        status: status || 'IN_PROGRESS',
        state: {
          incident_details: investigation.incident_details,
          risk_assessment: investigation.risk_assessment,
          evidence_available: investigation.evidence_available,
          missing_evidence: investigation.missing_evidence,
          five_whys: investigation.five_whys,
          fishbone: investigation.fishbone,
          root_cause_candidates: investigation.root_cause_candidates,
          capa_recommendations: investigation.capa_recommendations,
          active_tab: investigation.active_tab,
        },
      };

      const res = await fetch('/api/v1/investigations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save to database');
      const data = await res.json();
      dispatch(setActiveInvestigationId(data.id));
      dispatch(setToast({ type: 'success', message: `Investigation saved successfully! (ID: ${data.id.slice(0, 8)})` }));
    } catch (err) {
      dispatch(setToast({ type: 'error', message: `Save error: ${err.message}` }));
    } finally {
      setSaving(false);
    }
  };

  const handleNew = () => {
    if (confirm('Start a new investigation? Unsaved changes in the current view will be cleared.')) {
      dispatch(resetInvestigation());
      dispatch(setToast({ type: 'info', message: 'Initialized fresh RCA investigation.' }));
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(investigation, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${incident_details.incident_id || 'RCA-Investigation'}-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    dispatch(setToast({ type: 'info', message: 'Exported investigation JSON.' }));
  };

  return (
    <>
      <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur px-4 flex items-center justify-between z-30 sticky top-0">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <FlaskConical className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide text-white">AVIOVA.AI</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                API RCA Copilot
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-xs md:max-w-md">
              {incident_details.title || 'Awaiting Incident Intake & RCA Triaging...'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{status}</span>
          </div>

          <button
            onClick={handleNew}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition"
            title="Start new investigation"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">New</span>
          </button>

          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition"
            title="View saved investigations"
          >
            <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Saved</span>
          </button>

          <button
            onClick={handleExportJSON}
            disabled={!has_extracted}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
            title="Export full RCA report as JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Export</span>
          </button>

          <button
            onClick={handleSave}
            disabled={!has_extracted || saving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition shadow-sm shadow-cyan-600/30 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Save investigation to database"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Investigation'}</span>
          </button>
        </div>
      </header>

      <SavedDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
