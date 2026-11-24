import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Send, 
  Paperclip, 
  Sparkles, 
  Cpu, 
  Trash2, 
  FileUp, 
  X, 
  CheckCircle2, 
  Loader2, 
  Play,
  RotateCcw,
  Zap
} from 'lucide-react';
import { 
  addMessage, 
  setLoading, 
  setActiveTool, 
  setSelectedFile, 
  clearChat 
} from '../store/chatSlice';
import { setFullState, setToast } from '../store/investigationSlice';
import { FALLBACK_SAMPLE_INVESTIGATION } from '../utils/sampleData';

export default function ChatPanel() {
  const dispatch = useDispatch();
  const { messages, isLoading, activeTool, selectedFile } = useSelector((state) => state.chat);
  const investigationState = useSelector((state) => state.investigation);
  const [input, setInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customMessage = null) => {
    const textToSend = customMessage || input.trim();
    if (!textToSend && !selectedFile) return;

    const userMsgId = `user-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    dispatch(
      addMessage({
        id: userMsgId,
        role: 'user',
        content: selectedFile
          ? `[Uploaded File: ${selectedFile.name}]\n${textToSend || 'Analyze document and extract RCA investigation parameters.'}`
          : textToSend,
        timestamp,
        tool_badge: null,
      })
    );

    setInput('');
    dispatch(setLoading(true));

    try {
      let data;
      if (selectedFile) {
        dispatch(setActiveTool('Extraction (Document Parsing)'));
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append(
          'state_json',
          JSON.stringify({
            incident_details: investigationState.incident_details,
            risk_assessment: investigationState.risk_assessment,
            evidence_available: investigationState.evidence_available,
            missing_evidence: investigationState.missing_evidence,
            five_whys: investigationState.five_whys,
            fishbone: investigationState.fishbone,
            root_cause_candidates: investigationState.root_cause_candidates,
            capa_recommendations: investigationState.capa_recommendations,
            active_tab: investigationState.active_tab,
          })
        );

        const res = await fetch('/api/v1/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('File extraction failed on server.');
        data = await res.json();
        dispatch(setSelectedFile(null));
      } else {
        dispatch(setActiveTool('Processing Intent'));
        const res = await fetch('/api/v1/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: textToSend,
            current_state: {
              incident_details: investigationState.incident_details,
              risk_assessment: investigationState.risk_assessment,
              evidence_available: investigationState.evidence_available,
              missing_evidence: investigationState.missing_evidence,
              five_whys: investigationState.five_whys,
              fishbone: investigationState.fishbone,
              root_cause_candidates: investigationState.root_cause_candidates,
              capa_recommendations: investigationState.capa_recommendations,
              active_tab: investigationState.active_tab,
            },
          }),
        });

        if (!res.ok) throw new Error('AI Copilot request failed.');
        data = await res.json();
      }

      // Update Form State with diff
      dispatch(
        setFullState({
          newState: data.updated_state,
          changedFields: data.changed_fields,
        })
      );

      // Add Assistant Message
      dispatch(
        addMessage({
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tool_badge: data.tool_used,
        })
      );
    } catch (err) {
      dispatch(
        addMessage({
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ **Processing Error:** ${err.message}. Please check connection or retry.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tool_badge: 'Error',
        })
      );
      dispatch(setToast({ type: 'error', message: err.message }));
    } finally {
      dispatch(setLoading(false));
      dispatch(setActiveTool(null));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch(setSelectedFile(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      dispatch(setSelectedFile(file));
    }
  };

  const handleLoadSampleSafe = async () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    dispatch(
      addMessage({
        id: `user-${Date.now()}`,
        role: 'user',
        content: '⚡ Load sample incident',
        timestamp,
        tool_badge: null,
      })
    );
    dispatch(setLoading(true));
    dispatch(setActiveTool('Extraction (Sample Data)'));

    try {
      let stateToLoad = null;
      try {
        const res = await fetch('/api/v1/sample');
        if (res.ok) {
          const data = await res.json();
          if (data && data.state) {
            stateToLoad = data.state;
          }
        }
      } catch (networkErr) {
        console.warn('API sample fetch failed, using built-in offline state:', networkErr);
      }

      if (!stateToLoad) {
        stateToLoad = FALLBACK_SAMPLE_INVESTIGATION;
      }

      dispatch(
        setFullState({
          newState: stateToLoad,
          changedFields: [
            'incident_details',
            'risk_assessment',
            'evidence_available',
            'missing_evidence',
            'five_whys',
            'fishbone',
            'root_cause_candidates',
            'capa_recommendations',
          ],
        })
      );

      dispatch(
        addMessage({
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content:
            'Loaded realistic sample incident: **DEV-2026-0881 - Atorvastatin Calcium Crystallization Deviation**.\n\n' +
            'The form has been populated with incident details, risk assessment, 5 Whys, 6M Fishbone, root cause candidates, and CAPA recommendations. (Offline-safe intake ready)',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tool_badge: 'Extraction',
        })
      );

      dispatch(
        setToast({
          type: 'success',
          message: 'Loaded DEV-2026-0881 Atorvastatin Calcium sample deviation.',
        })
      );
    } catch (err) {
      dispatch(
        setFullState({
          newState: FALLBACK_SAMPLE_INVESTIGATION,
          changedFields: [
            'incident_details',
            'risk_assessment',
            'five_whys',
            'fishbone',
            'root_cause_candidates',
            'capa_recommendations',
          ],
        })
      );
      dispatch(
        setToast({
          type: 'info',
          message: 'Loaded sample deviation from local offline cache.',
        })
      );
    } finally {
      dispatch(setLoading(false));
      dispatch(setActiveTool(null));
    }
  };

  const quickChips = [
    { label: '⚡ Load Sample Incident', action: handleLoadSampleSafe },
    { label: '🔍 Run RCA (5 Whys & Fishbone)', action: () => handleSend('Run Root Cause Analysis (RCA)') },
    { label: '📋 Find Missing Evidence', action: () => handleSend('Find missing evidence and regulatory gaps') },
    { label: '🛡️ Suggest CAPA Plan', action: () => handleSend('Suggest CAPA recommendations') },
  ];

  return (
    <div
      className={`h-full flex flex-col bg-slate-900/40 border-l border-slate-800 transition-colors ${
        isDragging ? 'bg-cyan-950/20 border-cyan-500/50' : ''
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {/* Copilot Header */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-200 tracking-wide">AI COPILOT</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
            Groq LLaMA / GPT-OSS
          </span>
        </div>
        <button
          onClick={() => dispatch(clearChat())}
          className="text-slate-500 hover:text-slate-300 p-1 rounded transition"
          title="Reset chat history"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Action Chips */}
      <div className="px-3 py-2 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={chip.action}
            disabled={isLoading}
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-cyan-600 hover:text-white border border-slate-700 text-slate-300 font-medium transition disabled:opacity-40"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Header info */}
            <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400 font-mono">
              <span>{msg.role === 'user' ? 'Quality Officer' : 'AI Copilot'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
              {msg.tool_badge && (
                <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {msg.tool_badge}
                </span>
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[90%] rounded-xl p-3 leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-cyan-600 text-white rounded-tr-none'
                  : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans space-y-1">
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-400 text-xs w-fit animate-pulse">
            <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>{activeTool || 'Synthesizing quality response...'}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Selected File Preview Chip */}
      {selectedFile && (
        <div className="mx-3 mb-2 p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-between text-xs text-cyan-200">
          <div className="flex items-center gap-2 truncate">
            <FileUp className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="truncate font-medium">{selectedFile.name}</span>
            <span className="text-[10px] text-cyan-400 font-mono">
              ({(selectedFile.size / 1024).toFixed(1)} KB)
            </span>
          </div>
          <button
            onClick={() => dispatch(setSelectedFile(null))}
            className="p-1 text-cyan-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Chat Input Container */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <div className="relative rounded-xl border border-slate-700 bg-slate-900/80 focus-within:border-cyan-500 transition">
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe deviation, ask to run RCA, or type revisions (e.g., 'Change batch to ATC-26-092')..."
            className="w-full bg-transparent px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 resize-none focus:outline-none"
          />

          <div className="flex items-center justify-between px-2.5 py-1.5 border-t border-slate-800/60">
            {/* File Upload Trigger */}
            <div className="flex items-center gap-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.txt,.eml,.log"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
                title="Upload Deviation Report (PDF, TXT, EML)"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <span className="text-[10px] text-slate-500 hidden sm:inline">
                Accepts PDF, TXT, EML
              </span>
            </div>

            {/* Send Button */}
            <button
              onClick={() => handleSend()}
              disabled={isLoading || (!input.trim() && !selectedFile)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <span>Send</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
