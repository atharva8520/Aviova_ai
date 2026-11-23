import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function FishboneDiagram() {
  const fishbone = useSelector((state) => state.investigation.fishbone);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { key: 'machine', label: 'Machine / Equipment', ribX: 180, top: true, items: fishbone?.machine || [] },
    { key: 'method', label: 'Method / Process', ribX: 380, top: true, items: fishbone?.method || [] },
    { key: 'material', label: 'Material / Solvent', ribX: 580, top: true, items: fishbone?.material || [] },
    { key: 'man', label: 'Man / Personnel', ribX: 180, top: false, items: fishbone?.man || [] },
    { key: 'measurement', label: 'Measurement / QC', ribX: 380, top: false, items: fishbone?.measurement || [] },
    { key: 'environment', label: 'Environment / Milieu', ribX: 580, top: false, items: fishbone?.environment || [] },
  ];

  return (
    <div className="space-y-4">
      {/* SVG Diagram */}
      <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 overflow-x-auto shadow-inner">
        <div className="min-w-[760px] flex justify-center">
          <svg viewBox="0 0 800 320" className="w-full max-w-4xl h-auto select-none">
            {/* Background Grid Lines subtle */}
            <defs>
              <linearGradient id="spineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>

            {/* Main Spine */}
            <line x1="80" y1="160" x2="700" y2="160" stroke="url(#spineGrad)" strokeWidth="4" strokeLinecap="round" />
            <polygon points="700,150 730,160 700,170" fill="#06b6d4" />

            {/* Head: Deviation / Defect */}
            <g transform="translate(680, 125)">
              <rect x="0" y="0" width="105" height="70" rx="8" fill="#1e293b" stroke="#f43f5e" strokeWidth="2" />
              <text x="52" y="26" textAnchor="middle" fill="#fda4af" fontSize="10" fontWeight="bold">
                QUALITY
              </text>
              <text x="52" y="40" textAnchor="middle" fill="#fda4af" fontSize="10" fontWeight="bold">
                DEVIATION
              </text>
              <text x="52" y="55" textAnchor="middle" fill="#94a3b8" fontSize="9">
                (OOS / Failure)
              </text>
            </g>

            {/* Ribs (Upper & Lower) */}
            {categories.map((cat, idx) => {
              const startX = cat.ribX;
              const startY = cat.top ? 45 : 275;
              const endX = startX + 70;
              const endY = 160;
              const hasRootCause = cat.items.some((it) => it.is_root_cause);

              return (
                <g key={cat.key} className="cursor-pointer" onClick={() => setSelectedCategory(cat.key)}>
                  {/* Diagonal Rib Line */}
                  <line
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke={hasRootCause ? '#f43f5e' : '#475569'}
                    strokeWidth={hasRootCause ? '2.5' : '1.5'}
                    strokeDasharray={hasRootCause ? 'none' : '4 2'}
                  />

                  {/* Category Label Box */}
                  <rect
                    x={startX - 65}
                    y={cat.top ? startY - 26 : startY + 4}
                    width="130"
                    height="24"
                    rx="5"
                    fill={selectedCategory === cat.key ? '#0369a1' : '#0f172a'}
                    stroke={hasRootCause ? '#f43f5e' : '#334155'}
                    strokeWidth="1.5"
                  />
                  <text
                    x={startX}
                    y={cat.top ? startY - 10 : startY + 20}
                    textAnchor="middle"
                    fill={hasRootCause ? '#fda4af' : '#e2e8f0'}
                    fontSize="10"
                    fontWeight="600"
                  >
                    {cat.label} ({cat.items.length})
                  </text>

                  {/* Branch nodes for items */}
                  {cat.items.slice(0, 3).map((item, itemIdx) => {
                    const t = (itemIdx + 1) / (Math.min(cat.items.length, 3) + 1);
                    const nodeX = startX + (endX - startX) * t;
                    const nodeY = startY + (endY - startY) * t;
                    const branchEndX = nodeX - (cat.top ? 35 : 35);
                    const branchEndY = nodeY;

                    return (
                      <g key={item.id}>
                        <line
                          x1={nodeX}
                          y1={nodeY}
                          x2={branchEndX}
                          y2={branchEndY}
                          stroke={item.is_root_cause ? '#f43f5e' : '#64748b'}
                          strokeWidth="1"
                        />
                        <circle
                          cx={branchEndX}
                          cy={branchEndY}
                          r={item.is_root_cause ? '4' : '2.5'}
                          fill={item.is_root_cause ? '#f43f5e' : '#06b6d4'}
                        />
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 6M Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          return (
            <div
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`p-3 rounded-lg border transition cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500/60 ring-1 ring-cyan-500/20'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-200">{cat.label}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {cat.items.length} factors
                </span>
              </div>
              {cat.items.length === 0 ? (
                <p className="text-[11px] text-slate-600 italic">No causes flagged under this branch.</p>
              ) : (
                <ul className="space-y-1.5">
                  {cat.items.map((item) => (
                    <li key={item.id} className="flex items-start gap-1.5 text-[11px]">
                      {item.is_root_cause ? (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5 ml-1" />
                      )}
                      <span className={item.is_root_cause ? 'text-rose-200 font-medium' : 'text-slate-300'}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
