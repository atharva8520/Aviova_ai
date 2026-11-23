import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setToast } from '../store/investigationSlice';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.investigation.toast);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dispatch(setToast(null));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  if (!toast) return null;

  const bgMap = {
    success: 'bg-emerald-950 border-emerald-500/40 text-emerald-200',
    error: 'bg-rose-950 border-rose-500/40 text-rose-200',
    info: 'bg-cyan-950 border-cyan-500/40 text-cyan-200',
  };

  const iconMap = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400" />,
    info: <Info className="w-4 h-4 text-cyan-400" />,
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-2">
      <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border shadow-xl text-xs ${bgMap[toast.type] || bgMap.info}`}>
        {iconMap[toast.type] || iconMap.info}
        <span className="font-medium">{toast.message}</span>
        <button
          onClick={() => dispatch(setToast(null))}
          className="ml-2 p-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
