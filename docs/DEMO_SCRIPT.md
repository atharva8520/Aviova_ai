# Aviova.ai RCA Copilot - Official Demo Script & Presentation Guide

> **Target Audience:** Pharmaceutical Quality Assurance Directors, Regulatory Inspectors, Evaluators, Engineering Leadership  
> **Estimated Duration:** 5 to 7 Minutes  
> **Key Message:** Aviova.ai transforms pharmaceutical deviation investigations from slow, manual paperwork into an AI-augmented, audit-compliant RCA and CAPA workflow aligned with **ICH Q7, Q9, Q10, and 21 CFR 211.192**.

---

## ⏱️ Timeline Overview

| Time | Segment | Key Action / Screen Focus |
| :--- | :--- | :--- |
| **00:00 - 01:00** | Introduction & Problem Context | Split-screen interface & Read-Only compliance banner |
| **01:00 - 02:30** | Incident Intake & Risk Assessment | Click `⚡ Load Sample Incident` or upload PDF/EML |
| **02:30 - 04:00** | Deep RCA: 5 Whys & 6M Fishbone | Switch tabs, inspect 5 Whys ladder & interactive SVG diagram |
| **04:00 - 05:00** | Regulatory Review & QP Sign-off | Review candidate causes, confirm cause with Qualified Person modal |
| **05:00 - 06:00** | CAPA Recommendations & Tracking | Review Correction vs Corrective vs Preventive actions |
| **06:00 - 07:00** | Natural Language Revisions & Save | State-preserving edits via chat, save to DB, export JSON |

---

## 🎬 Step-by-Step Walkthrough

### Part 1: Problem Context & Split-Screen Architecture (0:00 - 1:00)

**Speaker Action:** Point to `http://localhost:3000` on the screen.

> **What to Say:**
> *"In Active Pharmaceutical Ingredient (API) manufacturing, a single out-of-specification result or temperature spike can halt multi-million-dollar production batches. Regulators under FDA 21 CFR 211.192 and ICH Q7 mandate that every unexplained deviation must undergo rigorous root cause analysis before batch disposition.*
>
> *Notice our UI layout: On the left (60%), we have the formal **RCA Investigation Record**. Notice the lock banner: manual direct typing is strictly prohibited to enforce ALCOA+ data integrity. On the right (40%), we have the **AI Copilot**, which acts as the quality engineer's intelligent assistant, ingesting documents, executing RCA methodologies, and proposing CAPAs."*

---

### Part 2: Natural Language Intake & Risk Assessment (1:00 - 2:30)

**Speaker Action:**
1. In the AI Copilot on the right, click the quick action chip: **`⚡ Load Sample Incident`** (or drag and drop `sample_documents/deviation_incident_0881.pdf`).
2. Watch the left panel smoothly illuminate with cyan glowing diff highlights (`animate-glow-diff`).

> **What to Say:**
> *"Let's simulate a real-world deviation. I'll click **Load Sample Incident**—which is fully offline-safe and powered by our Groq AI engine.*
>
> *Notice what just happened: The Copilot extracted the core parameters without hallucinating:*
> - *Product: Atorvastatin Calcium Trihydrate API*
> - *Batch Number: ATC-26-088*
> - *Process Stage: Final Stage Crystallization & Isolation*
> - *Equipment: Crystallizer Tank CR-104 & Chilling Unit CU-02*
>
> *In Section 2, the AI Risk Assessment immediately evaluated the Critical Quality Attribute impact: Related Substance Impurity D reached 0.28%, exceeding the USP specification limit of 0.15%. The Copilot recommends an immediate **Hold / Quarantine** disposition and cites ICH Q7 Section 13."*

---

### Part 3: Deep RCA — 5 Whys & 6M Ishikawa Fishbone (2:30 - 4:00)

**Speaker Action:**
1. Scroll down to Section 4: **Investigation Method: 5 Whys & Fishbone**.
2. Walk through the 5 Whys ladder.
3. Click the **Fishbone (6M Ishikawa)** tab to reveal the visual SVG diagram.

> **What to Say:**
> *"Now we move into the core investigation. How do we get past surface symptoms to the systemic failure?*
>
> *Under the **5 Whys tab**, the Copilot chained 5 causal links:*
> 1. *Why did Impurity D exceed spec? Slurry temperature spiked to 28.5°C.*
> 2. *Why did it spike? Secondary brine circulation stopped.*
> 3. *Why did circulation stop? Pneumatic valve CV-104 seized.*
> 4. *Why did the valve seize? Desiccant dryer DD-02 saturated, causing moisture condensation.*
> 5. *Why was moisture undetected? The preventive maintenance interval was quarterly instead of monthly during monsoon season, without an automated dew point alarm.*
>
> *Now let's switch to the **Fishbone tab**. Here, we render an interactive SVG 6M matrix—Machine, Method, Material, Man, Measurement, and Environment. Red markers highlight root cause contributors, allowing cross-functional plant teams to review equipment and process vulnerabilities at a glance."*

---

### Part 4: Regulatory Review & Qualified Person (QP) Sign-Off (4:00 - 5:00)

**Speaker Action:**
1. Scroll to Section 5: **Root Cause Candidates & Review**.
2. Point out the amber **ICH Q9 / 21 CFR 211.192 compliance alert banner**.
3. On row `RC-01`, click the green **Checkmark button**.
4. In the confirmation modal, type: `Dr. K. Rao (Lead QA Director)` and submit.

> **What to Say:**
> *"Here is where Aviova.ai strictly aligns with pharmaceutical law: Notice our persistent regulatory notice: **'AI-generated root causes are suggestions until supported by evidence and confirmed by a qualified person.'** Under cGMP, AI cannot legally close an investigation on its own.*
>
> *In the candidates table, each cause is classified as Probable Root Cause or Contributing Factor with likelihood and supporting evidence. When I click **Confirm**, a Qualified Person sign-off modal is invoked. Once confirmed, the row badge turns from 'AI Suggested' to 'Confirmed by Dr. K. Rao', recording the verification audit trail."*

---

### Part 5: CAPA Recommendations & Effectiveness Checks (5:00 - 6:00)

**Speaker Action:** Scroll to Section 6: **Corrective & Preventive Action (CAPA) Plan**.

> **What to Say:**
> *"Under ICH Q10, a quality system must distinguish between immediate containment and long-term prevention:*
> - *Row 1 is a **Correction**: Rebuilding valve CV-104 and flushing the lines within 7 days.*
> - *Row 2 is a **Corrective Action**: Revising SOP PM-UT-042 to monthly desiccant changeouts and installing online dew point sensors.*
> - *Row 3 is a **Preventive Action**: Rolling out SCADA rate-of-change temperature alarms across all Block 4 synthesis reactors.*
>
> *Every CAPA includes a designated owner role, realistic due window, and a verifiable effectiveness check criteria."*

---

### Part 6: State-Preserving Natural Language Revisions & Database Save (6:00 - 7:00)

**Speaker Action:**
1. In the AI Copilot chat box, type:
   ```text
   Change batch number to ATC-26-099 and update equipment ID to CR-108
   ```
2. Press **Enter**.
3. Point out that the Batch Number and Equipment ID update on the left with a cyan pulse, while all 5 Whys, Fishbone, evidence, and CAPA tables remain 100% untouched.
4. Click **Save Investigation** in the top header.
5. Click **Saved** to open the drawer showing the persisted records.

> **What to Say:**
> *"Finally, let's demonstrate **strict state preservation**. I'll instruct the Copilot: 'Change batch number to ATC-26-099 and equipment to CR-108'.*
>
> *Watch the left form: Only the target fields update with a cyan diff animation. All our 5 Whys, our Fishbone tree, our risk scores, and our CAPAs remain completely intact. No unmentioned data was erased or overwritten.*
>
> *Now I click **Save Investigation**. The complete investigation snapshot is saved to PostgreSQL/SQLite. We can also click **Saved** to inspect past investigations or **Export** to generate an inspectable JSON dossier ready for regulatory audits.*
>
> *This is Aviova.ai: Bringing rigorous, compliant, and auditable AI assistance to pharmaceutical manufacturing quality teams."*
