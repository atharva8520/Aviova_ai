# Aviova.ai - AI-Powered Root Cause Analysis (RCA) Copilot

> **Enterprise-grade, AI-assisted Root Cause Analysis & CAPA Recommendation System for Active Pharmaceutical Ingredient (API) Manufacturers**  
> Compliant with **ICH Q7**, **ICH Q9 (Quality Risk Management)**, **ICH Q10 (Pharmaceutical Quality System)**, and **FDA 21 CFR 211.192**.

---

## 🔬 Product Context & Pharma Workflow

In API pharmaceutical manufacturing, investigations follow a strict quality lifecycle:
$$\text{Deviation Identification} \longrightarrow \text{Root Cause Analysis (RCA)} \longrightarrow \text{Corrective \& Preventive Actions (CAPA)}$$

When an unexpected event occurs during API synthesis, crystallization, or purification (e.g., Out of Specification (OOS) impurity results, temperature excursions, mechanical seal failures, yield drops, or particulate contamination), quality teams must investigate the systemic cause rather than simply treating symptoms.

This system provides a **split-screen Copilot interface** that assists quality investigators while enforcing strict data integrity rules:
1. **Left Side (Form View - 60%)**: Read-only investigation record. Direct manual typing is disabled to ensure all parameters are corroborated and traced programmatically.
2. **Right Side (AI Copilot View - 40%)**: Interactive assistant that accepts incident narratives, uploads (.pdf, .txt, .eml), runs 5 Whys and Fishbone analyses, and updates fields through natural language commands with **strict state preservation** and **visual diff highlighting**.

---

## 🚀 Key Features

- **Document Extraction (Intake Engine)**: Automatically extracts Incident ID, Title, Product/Intermediate, Batch/Lot No., Equipment ID, Process Stage, Date/Time, Severity, and Initial Containment actions from uploaded PDF, TXT, or EML files.
- **AI Copilot Risk Assessment**: Evaluates Critical Quality Attributes (CQA), Patient/Product Impact, and batch disposition (Hold/Quarantine) with technical reasoning based on ICH Q7.
- **Evidence Corroboration & Missing Evidence Gaps**: Flags critical missing evidence (utility trends, calibration records, analytical assays) required by regulatory inspectors before concluding an investigation.
- **5 Whys Analysis**: Generates progressive causal steps leading from the immediate symptom down to the systemic root cause, complete with evidence links and confidence levels.
- **6M Ishikawa (Fishbone) Visual Diagram**: Renders an interactive SVG diagram categorizing causes across the 6Ms: **Machine**, **Method**, **Material**, **Man**, **Measurement**, and **Environment**.
- **Root Cause Review with Qualified Person (QP) Sign-off**: Follows ICH Q9 guidance stating that AI-generated causes are suggestions until confirmed by a qualified investigator. Supports one-click review modals and chat commands (`"Confirm cause 1 by Dr. Rao"`).
- **CAPA Lifecycle Planning**: Formulates differentiated **Corrections**, **Corrective Actions**, and **Preventive Actions** linked to identified causes, with suggested owner roles, due windows, and measurable effectiveness checks.
- **State Preservation on Edit**: Natural language edits (`"Change batch number to ATC-26-099"`) update only the specified fields, leaving all other data and risk scores 100% intact.
- **Database Persistence**: Save and recall investigations with full JSON state in PostgreSQL / SQLite.

---

## 🛠️ Mandatory Tech Stack

- **Frontend**: React 18, Vite, Redux Toolkit, Lucide Icons, Tailwind CSS
- **Backend**: Python 3.11+, FastAPI, SQLAlchemy, Pydantic v2
- **AI Engine**: LangGraph router, Groq (`llama-3.3-70b-versatile` with automatic fallback to `llama-3.1-8b-instant`)
- **Document Processing**: `pypdf`, `pdfplumber`, Python `email`
- **Database**: PostgreSQL with automatic SQLite fallback for zero-setup execution

---

## ⚡ Quick Start

### 1. Prerequisites
- Python 3.11+
- Node.js 18+ & npm
- (Optional) Docker & Docker Compose
- (Optional) Groq API Key

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your `GROQ_API_KEY` (if not provided, the Copilot falls back to an intelligent, deterministic pharmaceutical domain engine).

### 3. Run Backend
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend runs at: `http://localhost:8000` (API Docs: `http://localhost:8000/docs`)

### 4. Run Frontend
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:3000`

---

## 🐳 Docker Compose (One-Command Deployment)

To start the full PostgreSQL, FastAPI backend, and React frontend stack:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

---

## 🧪 Automated Test Suite

Run backend and RCA workflow verification:
```bash
python backend/test_backend.py
python backend/test_upload.py
```
Both verify:
1. Health check & configuration
2. Incident state extraction
3. 5 Whys & Fishbone generation
4. State-preserving revisions
5. Qualified person root cause confirmation
6. Database save, list, and retrieval
7. Document uploads (PDF, TXT, EML)

---

## 📋 Sample Files Included

- `sample_documents/deviation_incident_0881.pdf`: Atorvastatin crystallization OOS deviation
- `sample_documents/deviation_incident_0881.txt`: Plain text deviation notification
- `sample_documents/deviation_email.eml`: Sterile Meropenem API particulate deviation notification

Or simply click the **"⚡ Load Sample Incident"** quick action chip inside the AI Copilot panel!
