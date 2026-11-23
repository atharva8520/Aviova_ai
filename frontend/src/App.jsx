import React from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import IncidentDetailsSection from './components/IncidentDetailsSection';
import RiskAssessmentSection from './components/RiskAssessmentSection';
import EvidenceSection from './components/EvidenceSection';
import InvestigationMethodsSection from './components/InvestigationMethodsSection';
import RootCauseTable from './components/RootCauseTable';
import CapaTable from './components/CapaTable';
import ChatPanel from './components/ChatPanel';
import Toast from './components/Toast';

export default function App() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Top Application Header */}
      <Header />

      {/* Main Split-Screen Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left 60%: Form View (Read-Only, Programmatically Populated by AI Copilot) */}
        <div className="w-full md:w-[60%] h-full overflow-y-auto p-4 space-y-4 border-r border-slate-800">
          <Banner />
          <IncidentDetailsSection />
          <RiskAssessmentSection />
          <EvidenceSection />
          <InvestigationMethodsSection />
          <RootCauseTable />
          <CapaTable />
          <div className="h-6" /> {/* Bottom breathing room */}
        </div>

        {/* Right 40%: Assistant View (AI Copilot Chat, Upload, Revisions) */}
        <div className="w-full md:w-[40%] h-full overflow-hidden">
          <ChatPanel />
        </div>
      </div>

      {/* Persistent Toast Notifications */}
      <Toast />
    </div>
  );
}
