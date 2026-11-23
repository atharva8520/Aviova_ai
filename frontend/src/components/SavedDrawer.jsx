import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  FolderOpen, 
  X, 
  Trash2, 
  Clock, 
  ExternalLink, 
  AlertCircle 
} from 'lucide-react';
import { 
  setFullState, 
  setActiveInvestigationId, 
  setStatus, 
  setToast 
} from '../store/investigationSlice';

export default function SavedDrawer({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInvestigations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/investigations');
      if (res.ok) {
        const data = await res.json();
        setList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchInvestigations();
    }
  }, [isOpen]);

  const handleLoad = async (id) => {
    try {
      const res = await fetch(`/api/v1/investigations/${id}`);
      if (!res.ok) throw new Error('Failed to load investigation');
      const data = await res.json();

      dispatch(
        setFullState({
          newState: data.state,
          changedFields: ['incident_details', 'risk_assessment', 'five_whys', 'fishbone', 'root_cause_candidates', 'capa_recommendations'],
        })
      );
      dispatch(setActiveInvestigationId(data.id));
      dispatch(setStatus(data.status));
      dispatch(setToast({ type: 'success', message: `Loaded: ${data.title}` }));
      onClose();
    } catch (err) {
      dispatch(setToast({ type: 'error', message: err.message }));
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this saved investigation?')) return;
    try {
      const res = await fetch(`/api/v1/investigations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setList(list.filter((it) => it.id !== id));
        dispatch(setToast({ type: 'info', message: 'Investigation record deleted.' }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col p-4 shadow-2xl animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <FolderOpen className="w-5 h-5" />
            <h3 className="font-semibold text-sm text-slate-100">Saved RCA Investigations</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {loading ? (
            <div className="text-center py-8 text-xs text-slate-500">Loading saved records...</div>
          ) : list.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No saved investigations found in the database.
            </div>
          ) : (
            list.map((inv) => (
              <div
                key={inv.id}
                onClick={() => handleLoad(inv.id)}
                className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer flex flex-col gap-1 text-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-cyan-400 font-semibold">
                    {inv.incident_id || 'INC-ID'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {inv.status}
                    </span>
                    <button
                      onClick={(e) => handleDelete(inv.id, e)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="font-medium text-slate-200 group-hover:text-cyan-300 transition">
                  {inv.title}
                </p>
                <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  {new Date(inv.updated_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
