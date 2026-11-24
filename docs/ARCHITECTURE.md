# System Architecture & Technical Design: Aviova.ai RCA Copilot

Enterprise-grade AI-powered Root Cause Analysis (RCA) and Corrective and Preventive Action (CAPA) Copilot designed for Active Pharmaceutical Ingredient (API) manufacturing plants, strictly adhering to **ICH Q7**, **ICH Q9 (Quality Risk Management)**, **ICH Q10 (Pharmaceutical Quality System)**, and **FDA 21 CFR 211.192**.

---

## 1. High-Level System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend Layer (React 18 + Redux Toolkit)"]
        UI["Split-Screen UI"]
        LockedForm["Locked Form View (60%)\n• Incident Details\n• Risk Assessment\n• Evidence & Gaps\n• 5 Whys & 6M Fishbone\n• Root Cause Review & QP Sign-off\n• CAPA Table"]
        CopilotPanel["AI Copilot Panel (40%)\n• Chat & File Upload\n• Quick Action Chips\n• Live Diff Animator"]
        ReduxStore["Redux Toolkit Store\n(Normalized RCA State & Diffs)"]
        UI --> ReduxStore
        ReduxStore --> LockedForm
        ReduxStore --> CopilotPanel
    end

    subgraph API["Backend Service Layer (FastAPI + Python 3.12)"]
        Router["FastAPI REST Endpoints\n• /api/v1/chat\n• /api/v1/upload\n• /api/v1/investigations\n• /api/v1/sample"]
        DocParser["Document Parser\n(pypdf / pdfplumber / email)"]
    end

    subgraph AI["AI Reasoning Engine (LangGraph + Groq)"]
        GraphRouter{"LangGraph Intent Classifier"}
        ExtractNode["extract_incident Node"]
        RCANode["run_rca Node (5 Whys + Fishbone)"]
        GapNode["find_missing_evidence Node"]
        CAPANode["suggest_capa Node"]
        EditNode["edit_investigation Node\n(State-Preserving Patch)"]
        ChatNode["general_qa / GMP Chat Node"]
        GroqEngine["Groq API Frontier Models\n• openai/gpt-oss-120b\n• qwen/qwen3.8-27b\n• llama-3.3-70b-versatile"]
        FallbackEngine["Deterministic GMP Domain Fallback\n(Guaranteed Zero-Crash / Offline-Safe)"]
    end

    subgraph DB["Persistence Layer (SQLAlchemy 2.0)"]
        Postgres[(PostgreSQL 15 Container)]
        SQLite[(SQLite Local Fallback)]
    end

    CopilotPanel -- "Chat / Form Updates" --> Router
    CopilotPanel -- "PDF / TXT / EML Files" --> DocParser
    DocParser --> Router
    Router --> GraphRouter

    GraphRouter --> ExtractNode
    GraphRouter --> RCANode
    GraphRouter --> GapNode
    GraphRouter --> CAPANode
    GraphRouter --> EditNode
    GraphRouter --> ChatNode

    ExtractNode --> GroqEngine
    RCANode --> GroqEngine
    GapNode --> GroqEngine
    CAPANode --> GroqEngine
    EditNode --> GroqEngine
    ChatNode --> GroqEngine

    GroqEngine -. "Fallback on 404/Quota/Offline" .-> FallbackEngine

    GroqEngine --> ReduxStore
    FallbackEngine --> ReduxStore

    Router <--> DB
    DB -.-> Postgres
    DB -.-> SQLite
```

---

## 2. LangGraph Intent & State Workflow

The AI engine uses an intelligent state-machine graph routing incoming interactions to specialized pharmaceutical quality nodes:

```mermaid
stateDiagram-v2
    [*] --> Intake
    Intake --> Router: User Prompt or Uploaded File

    state Router {
        [*] --> Classify
        Classify --> ExtractIncident: Deviation text / file upload
        Classify --> RunRCA: "Run RCA" / 5 Whys / Fishbone
        Classify --> MissingEvidence: "Find missing evidence" / Gaps
        Classify --> SuggestCAPA: "Suggest CAPA" / Corrective actions
        Classify --> EditField: "Change batch..." / "Confirm cause..."
        Classify --> GeneralChat: GMP queries / questions
    }

    ExtractIncident --> DiffAnalyzer: Extract CQA, Risk, Available Evidence
    RunRCA --> DiffAnalyzer: Generate 5 Whys & 6M Ishikawa Tree
    MissingEvidence --> DiffAnalyzer: Identify Gaps under ICH Q7/Q9
    SuggestCAPA --> DiffAnalyzer: Map Root Causes to CAPA & Effectiveness Checks
    EditField --> DiffAnalyzer: Patch targeted keys ONLY (Preserve remaining state)
    GeneralChat --> Response: QA Advisory Response

    DiffAnalyzer --> Response: Return Updated State + Changed Keys
    Response --> [*]: Render Cyan Glowing Diff in Left Form
```

---

## 3. Data Model Schema

The full RCA investigation state is modeled strictly with Pydantic v2 schemas:

```mermaid
classDiagram
    class RCAInvestigationState {
        +IncidentDetails incident_details
        +RiskAssessment risk_assessment
        +List~EvidenceItem~ evidence_available
        +List~MissingEvidenceItem~ missing_evidence
        +List~FiveWhysStep~ five_whys
        +Fishbone6M fishbone
        +List~RootCauseCandidate~ root_cause_candidates
        +List~CAPARecommendation~ capa_recommendations
        +String active_tab
        +List~String~ last_updated_fields
    }

    class IncidentDetails {
        +String incident_id
        +String title
        +String description
        +String product_intermediate
        +String batch_lot_no
        +String process_stage
        +String equipment_id
        +String date_time_occurrence
        +String reported_by
        +String area_department
        +String immediate_action_taken
        +String impact_assessment
        +Severity severity
    }

    class RiskAssessment {
        +Severity severity
        +String product_patient_impact
        +String batch_disposition
        +String next_recommended_action
        +String reasoning
    }

    class FiveWhysStep {
        +Int step
        +String question
        +String answer
        +String evidence
        +Confidence confidence
    }

    class Fishbone6M {
        +List~FishboneItem~ man
        +List~FishboneItem~ machine
        +List~FishboneItem~ method
        +List~FishboneItem~ material
        +List~FishboneItem~ measurement
        +List~FishboneItem~ environment
    }

    class RootCauseCandidate {
        +String id
        +String cause
        +String category
        +Likelihood likelihood
        +String supporting_evidence
        +Classification classification
        +Status status
        +String confirmed_by
        +String confirmed_at
    }

    class CAPARecommendation {
        +String id
        +CAPAType type
        +String action
        +String rationale
        +String linked_root_cause
        +String owner_role
        +String due_window
        +String effectiveness_check
        +Status status
    }

    RCAInvestigationState *-- IncidentDetails
    RCAInvestigationState *-- RiskAssessment
    RCAInvestigationState *-- FiveWhysStep
    RCAInvestigationState *-- Fishbone6M
    RCAInvestigationState *-- RootCauseCandidate
    RCAInvestigationState *-- CAPARecommendation
```

---

## 4. Regulatory Compliance Matrix

| Requirement | Regulatory Reference | Implementation in Aviova.ai Copilot |
| :--- | :--- | :--- |
| **Data Integrity & Auditability** | FDA 21 CFR Part 11 / 211.68 | Left-side form fields are programmatically locked against manual direct editing. Revisions require tracked Copilot prompts. |
| **Unexplained Discrepancy Investigation** | 21 CFR 211.192 / ICH Q7 Section 2.5 | Automated extraction of Critical Quality Attributes (CQA), lot records, equipment IDs, and initial containment actions. |
| **Quality Risk Management (QRM)** | ICH Q9 | Automated Risk Assessment evaluating severity, patient/product impact, batch quarantine disposition, and evidence corroboration. |
| **Systemic Root Cause Analysis** | ICH Q7 / ICH Q10 | Structured 5 Whys drilldown chain and interactive SVG 6M Ishikawa (Fishbone) diagram linking process factors to true root causes. |
| **Qualified Person (QP) Sign-Off** | EU GMP Annex 16 / ICH Q9 | Regulatory disclaimer enforcing that AI suggestions require verification; confirmation workflow captures QP name and timestamp. |
| **CAPA Lifecycle & Effectiveness** | ICH Q10 Section 3.2.2 | Differentiated **Correction**, **Corrective Action**, and **Preventive Action** tracking with designated owner roles and measurable verification checks. |
| **State Preservation on Revisions** | ALCOA+ Principles | Revisions patch only explicitly targeted parameters; unmentioned fields, causal links, and risk scores remain 100% intact. |
