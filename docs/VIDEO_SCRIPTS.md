# Aviova.ai - Official Video Recording Plan & Script

This guide provides a camera-ready, timestamped recording plan for the two demonstration videos.

---

# 🎥 Video 1: Product Demonstration (5–8 Minutes)

* **Goal:** Showcase the end-to-end pharmaceutical quality workflow from deviation intake to root cause analysis (RCA) and CAPA recommendation, emphasizing regulatory compliance (ICH Q7, Q9, Q10, 21 CFR 211.192).
* **Target Audience:** Quality Directors, Regulatory Auditors, Technical Evaluators, and Recruiters.
* **Screen Setup:** Browser window maximized at `http://localhost:3000`. Clean dark mode theme, zero browser bookmarks, 100% zoom.

---

### Segment 1: Hook & Regulatory Context (00:00 – 01:00)
* **What to Show on Screen:**
  - Browser on `http://localhost:3000`.
  - Mouse hovers over the top navigation header: `AVIOVA.AI • API RCA COPILOT` and the status badge `[IN_PROGRESS]`.
  - Mouse circles the cyan lock banner: `LOCKED • Read-Only Form: Direct manual typing is disabled`.
* **What to Say (Voiceover):**
  > *"Welcome to Aviova.ai, an AI-powered Root Cause Analysis and CAPA Copilot built specifically for Active Pharmaceutical Ingredient (API) manufacturers.*
  >
  > *In pharmaceutical manufacturing, when an Out of Specification result, impurity excursion, or temperature spike occurs, FDA 21 CFR 211.192 and ICH Q7 strictly mandate a thorough, documented investigation before batch release.*
  >
  > *Traditional investigations are bogged down in manual paperwork and inconsistent causal analysis. Aviova.ai introduces a split-screen paradigm: On the left (60%), we have the formal **RCA Investigation Record**, programmatically locked to enforce ALCOA+ data integrity. On the right (40%), we have the **AI Copilot**, an interactive assistant that ingests batch evidence, performs systematic RCA, and formulates CAPA plans."*

---

### Segment 2: Intake & AI Risk Assessment (01:00 – 02:30)
* **What to Show on Screen:**
  - On the right panel, highlight the file upload dropzone and quick-action chips.
  - Click the **`⚡ Load Sample Incident`** chip.
  - Watch the left form illuminate with the cyan glowing diff animation (`animate-glow-diff`).
  - Scroll down Section 1 (Incident Details) and Section 2 (Risk Assessment).
* **What to Say (Voiceover):**
  > *"Let's begin with incident intake. The investigator can drag and drop a laboratory PDF report, an automated SCADA email alert, or click **Load Sample Incident**.*
  >
  > *Instantly, the Copilot parses the document:*
  > - *Incident DEV-2026-0881: Atorvastatin Calcium Trihydrate API.*
  > - *Batch Number: ATC-26-088.*
  > - *Process Stage: Final Stage Crystallization in Tank CR-104.*
  >
  > *Look at Section 2: The Copilot automatically generates an **ICH Q9 Risk Assessment**. It notes that Related Substance Impurity D reached 0.28%, exceeding the USP limit of 0.15%. It immediately recommends an amber **Hold / Quarantine** disposition and provides the cGMP rationale citing 21 CFR 211.192."*

---

### Segment 3: Deep RCA — 5 Whys & 6M Fishbone (02:30 – 04:15)
* **What to Show on Screen:**
  - Scroll to Section 4: **Investigation Method: 5 Whys & Fishbone**.
  - Review steps 1 through 5 in the **5 Whys Chain**.
  - Click the **`Fishbone (6M Ishikawa)`** tab to display the interactive SVG diagram.
  - Click on the `Machine / Equipment` category card to highlight the seized valve and saturated dryer nodes.
* **What to Say (Voiceover):**
  > *"Now we move into systematic root cause analysis. Symptom-level corrections aren't enough; regulators demand finding the systemic root cause.*
  >
  > *Under the **5 Whys tab**, the Copilot builds a step-by-step causal ladder:*
  > 1. *Why did Impurity D form? Slurry temperature spiked to 28.5°C.*
  > 2. *Why did temperature spike? Chilled brine circulation stopped.*
  > 3. *Why did circulation stop? Pneumatic valve CV-104 jammed in an 8% open position.*
  > 4. *Why did the valve jam? Instrument air desiccant dryer DD-02 saturated, introducing water condensate.*
  > 5. *Why was it undetected? Preventive maintenance frequency was set to quarterly instead of monthly during high-humidity monsoon season, without an automated dew point alarm.*
  >
  > *Now look at the **Fishbone diagram**: The Copilot maps all contributing factors across the 6Ms—Machine, Method, Material, Man, Measurement, and Environment. Red indicator nodes pinpoint the validated root causes on the spine."*

---

### Segment 4: QP Sign-Off & Regulatory Review (04:15 – 05:30)
* **What to Show on Screen:**
  - Scroll to Section 5: **Root Cause Candidates & Review**.
  - Point to the amber **ICH Q9 Regulatory Compliance Notice**.
  - Click the green **Checkmark (Accept)** button on row `RC-01`.
  - In the modal that appears, enter: `Dr. Anita Desai (Director QA)` and click **Confirm Root Cause**.
  - Show the row badge change to `Confirmed by Dr. Anita Desai`.
* **What to Say (Voiceover):**
  > *"Notice Section 5: Here we enforce a vital regulatory boundary. The banner states: **'AI-generated root causes are suggestions until supported by evidence and confirmed by a qualified person.'** Under cGMP, AI can advise, but a human Qualified Person must take legal ownership.*
  >
  > *In the table, candidate causes are scored by likelihood and evidence. When I click **Confirm**, a Qualified Person sign-off dialog appears. I record Dr. Anita Desai as the Qualified Person. Once submitted, the badge updates with an auditable timestamp."*

---

### Segment 5: CAPA Lifecycle & Effectiveness Checks (05:30 – 06:45)
* **What to Show on Screen:**
  - Scroll to Section 6: **Corrective & Preventive Action (CAPA) Plan**.
  - Point out the distinct badges: `Correction`, `Corrective Action`, `Preventive Action`.
  - Highlight the `Owner Role`, `Due Window`, and `Effectiveness Check` columns.
  - Click the checkmark to accept `CAPA-01` and `CAPA-02`.
* **What to Say (Voiceover):**
  > *"Next is CAPA formulation under ICH Q10. The Copilot structures three distinct tiers:*
  > 1. *A **Correction**: Immediate physical remediation—rebuilding valve CV-104 and flushing lines with dry nitrogen within 7 days.*
  > 2. *A **Corrective Action**: Addressing the cause—updating SOP PM-UT-042 to monthly changeouts during monsoon and installing an inline dew point transmitter.*
  > 3. *A **Preventive Action**: System-wide protection—implementing SCADA rate-of-change temperature alarms across all synthesis vessels in Block 4.*
  >
  > *Crucially, every CAPA includes an **Effectiveness Check**, ensuring the action is audited after implementation."*

---

### Segment 6: State Preservation, Save & Export (06:45 – 08:00)
* **What to Show on Screen:**
  - In the AI Copilot chat box on the right, type:
    ```text
    Change batch number to ATC-26-099 and update equipment ID to CR-108
    ```
  - Press **Enter**. Point out the cyan glow on Batch Number and Equipment ID while 5 Whys and CAPA tables remain 100% untouched.
  - Click **Save Investigation** in the top bar (show success toast).
  - Click **Saved** in the top bar (show drawer with seeded and saved records).
  - Click **Export** to download the JSON dossier.
* **What to Say (Voiceover):**
  > *"Finally, let's observe **state preservation**. If an investigator receives updated lab results, they prompt the Copilot: 'Change batch number to ATC-26-099 and equipment to CR-108'.*
  >
  > *Watch the left form: Only the target fields update with a cyan pulse. All our 5 Whys, our Fishbone tree, our risk scores, and our CAPAs remain completely intact. No unmentioned data was erased or overwritten.*
  >
  > *Now I click **Save Investigation**. The complete investigation snapshot is saved to the database. We can inspect past investigations in the **Saved** drawer or click **Export** to generate an inspectable JSON dossier ready for regulatory submission.*
  >
  > *Thank you for watching the Aviova.ai demonstration."*

---
---

# 💻 Video 2: Technical Walkthrough & Code Tour (5–10 Minutes)

* **Goal:** Present the technical engineering behind Aviova.ai: LangGraph agent routing, Groq LLM integration with fallback chains, Pydantic v2 schemas, document extraction, Redux state diffing, and Docker deployment.
* **Target Audience:** Engineering Leads, Full-Stack Developers, AI System Architects, and Technical Judges.
* **Screen Setup:** Split screen or dual windows: VS Code on the left, Browser (with `http://localhost:3000` & `http://localhost:8000/docs`) on the right.

---

### Segment 1: Tech Stack & System Architecture (00:00 – 01:30)
* **What to Show on Screen:**
  - Open `docs/ARCHITECTURE.md` in VS Code and preview the Mermaid flowchart.
  - Terminal showing running processes (Uvicorn backend on 8000, Vite frontend on 3000).
* **What to Say (Voiceover):**
  > *"Welcome to the technical architecture walkthrough of Aviova.ai. Today, we'll dive into the codebase and engineering decisions behind our pharmaceutical RCA Copilot.*
  >
  > *Our mandatory stack comprises:*
  > - *Frontend: React 18, Vite, Redux Toolkit, and Tailwind CSS.*
  > - *Backend: Python 3.12, FastAPI, SQLAlchemy 2.0, and Pydantic v2.*
  > - *AI Engine: LangGraph intent routing with Groq cloud frontier models (`openai/gpt-oss-120b`, `qwen/qwen3.8-27b`, `llama-3.3-70b-versatile`) and a zero-crash deterministic domain engine.*
  > - *Persistence: PostgreSQL 15 via Docker Compose with automatic SQLite fallback.*
  >
  > *Let's look at how data flows from the UI through LangGraph to our LLMs and database."*

---

### Segment 2: LangGraph Routing & AI Engine (01:30 – 04:00)
* **What to Show on Screen:**
  - Open `backend/app/services/ai_graph.py`.
  - Highlight `ROUTER_SYSTEM_PROMPT` (lines 20–35), `invoke_llm_with_fallback` (lines 55–85), and `execute_ai_workflow` (lines 560–630).
* **What to Say (Voiceover):**
  > *"Let's inspect `backend/app/services/ai_graph.py`. Rather than relying on unstructured chat prompts, we implement a stateful LangGraph router.*
  >
  > *Incoming requests—whether raw text, document extractions, or conversational edits—pass through `classify_intent()`. This router maps intent into discrete nodes:*
  > - `extract_incident`: *Extracts CQAs, equipment IDs, and initial containment.*
  > - `run_rca`: *Constructs 5 Whys and 6M Ishikawa classifications.*
  > - `find_missing_evidence`: *Audits records against ICH Q7 requirements.*
  > - `suggest_capa`: *Generates tiered actions with owner roles and verification checks.*
  > - `edit_investigation`: *Calculates targeted JSON patches for state preservation.*
  >
  > *Notice `invoke_llm_with_fallback()`. To prevent downtime, it cycles through candidate models on Groq: primary model first, followed by secondary models, and if all external APIs are unreachable, it invokes our deterministic GMP domain fallback. The app never crashes or returns 500 errors."*

---

### Segment 3: State Preservation Engine & Schemas (04:00 – 06:00)
* **What to Show on Screen:**
  - Open `backend/app/schemas/investigation.py`.
  - Scroll through `IncidentDetails`, `RiskAssessment`, `FiveWhysStep`, `Fishbone6M`, `RootCauseCandidate`, and `CAPARecommendation`.
  - Show `handle_edit_investigation()` in `ai_graph.py` demonstrating how only targeted keys are patched.
* **What to Say (Voiceover):**
  > *"Data integrity is paramount in life sciences. In `backend/app/schemas/investigation.py`, our entire investigation state is strongly typed using Pydantic v2 models.*
  >
  > *Notice our state preservation logic in `handle_edit_investigation()`. When a user says 'Change batch number to ATC-26-099', the router identifies the `incident_details` slice, applies a granular patch, and returns `changed_fields: ['incident_details']`.*
  >
  > *All other objects—the risk assessment, the 5 Whys chain, the Fishbone items, and the CAPA plans—are preserved verbatim. The response returns both the updated state and the exact diff list, which feeds directly into our UI animation engine."*

---

### Segment 4: Frontend Redux Store & Diff Glow UI (06:00 – 07:30)
* **What to Show on Screen:**
  - Open `frontend/src/store/investigationSlice.js`.
  - Open `frontend/src/components/FishboneDiagram.jsx`.
  - Show the browser side-by-side: trigger an edit in chat and highlight the cyan border animation triggered by `last_updated_fields`.
* **What to Say (Voiceover):**
  > *"On the client side, state is managed via Redux Toolkit in `investigationSlice.js`. Notice the `last_updated_fields` array in state.*
  >
  > *When an AI action resolves, `setFullState` updates the normalized state slices and sets `last_updated_fields`.*
  >
  > *Each form component—like `IncidentDetailsSection` or `RootCauseTable`—checks if its slice name is in `last_updated_fields`. If present, Tailwind's custom keyframe `animate-glow-diff` pulses a cyan border and background, giving the user immediate visual feedback of what the AI modified.*
  >
  > *In `FishboneDiagram.jsx`, the 6M Ishikawa tree is rendered as pure SVG with mathematical coordinate mapping, drawing ribs for Machine, Method, Material, Man, Measurement, and Environment, with interactive category cards."*

---

### Segment 5: Multi-Format Document Extraction (07:30 – 08:45)
* **What to Show on Screen:**
  - Open `backend/app/services/document_parser.py`.
  - Show `sample_documents/deviation_incident_0881.pdf`, `deviation_incident_0881.txt`, and `deviation_email.eml`.
  - In Swagger UI (`http://localhost:8000/docs`), show the `POST /api/v1/upload` endpoint.
* **What to Say (Voiceover):**
  > *"For document intake, `backend/app/services/document_parser.py` supports PDF, plain text, and RFC 822 email (.eml) files.*
  >
  > *For PDFs, it uses `pypdf` with fallback to `pdfplumber`. For `.eml` files, it uses Python's standard `email` policy parser to extract headers, timestamps, and multi-part text bodies.*
  >
  > *The raw extracted text is passed directly into the LangGraph `extract_incident` node, converting messy incident narratives into structured regulatory JSON."*

---

### Segment 6: Database Persistence, Tests & Wrap-Up (08:45 – 10:00)
* **What to Show on Screen:**
  - Open `docker-compose.yml`.
  - Run `python backend/test_backend.py` in the terminal to show all tests passing 100%.
  - Show `docs/ARCHITECTURE.md` and `docs/DEMO_SCRIPT.md` in the repository tree.
* **What to Say (Voiceover):**
  > *"For deployment, our `docker-compose.yml` orchestrates three services: the PostgreSQL 15 database, the FastAPI backend, and the Vite frontend served via Nginx.*
  >
  > *Notice our startup hook in `main.py`: When launched fresh, it automatically seeds an initial demo investigation so the Saved drawer is never empty.*
  >
  > *Let's run our automated test suite in the terminal: `python backend/test_backend.py`. All tests pass—validating health, extraction, state preservation, Qualified Person sign-off, and DB persistence.*
  >
  > *The complete repository, along with full documentation and demo scripts, is available at `github.com/atharva8520/Aviova_ai`.*
  >
  > *Thank you for your time!"*

---

## 🛠️ Recording Tips & Production Checklist

1. **Resolution:** Record in 1080p (1920x1080) at 60 FPS.
2. **Audio:** Use a clean USB microphone; ensure background noise suppression is active.
3. **Pacing:** Speak at a deliberate, confident pace (~130 words per minute).
4. **Mouse Control:** Move the cursor deliberately; avoid rapid, erratic circles.
5. **Zoom:** Use 100% browser zoom for wide split-screen views; zoom to 110% in VS Code when showing specific functions.
