from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field

# --- Incident Details ---
class IncidentDetails(BaseModel):
    incident_id: Optional[str] = Field(default=None, description="e.g. INC-2024-0881")
    title: Optional[str] = Field(default=None, description="Short summary of incident")
    description: Optional[str] = Field(default=None, description="Detailed description")
    product_intermediate: Optional[str] = Field(default=None, description="API or Intermediate name")
    batch_lot_no: Optional[str] = Field(default=None, description="Batch or lot number")
    process_stage: Optional[str] = Field(default=None, description="e.g. Crystallization, Synthesis, Centrifugation")
    equipment_id: Optional[str] = Field(default=None, description="e.g. CR-104, Centrifuge CF-02")
    date_time_occurrence: Optional[str] = Field(default=None, description="ISO or formatted string")
    reported_by: Optional[str] = Field(default=None, description="Reporting officer name/role")
    area_department: Optional[str] = Field(default=None, description="e.g. API Block 3 / Production")
    immediate_action_taken: Optional[str] = Field(default=None, description="Immediate containment actions")
    impact_assessment: Optional[str] = Field(default=None, description="Initial assessment of impact")
    severity: Literal["Critical", "Major", "Minor"] = Field(default="Major")

# --- Risk Assessment ---
class RiskAssessment(BaseModel):
    severity: Literal["Critical", "Major", "Minor"] = Field(default="Major")
    product_patient_impact: Optional[str] = Field(default=None, description="Impact on critical quality attributes (CQA)")
    batch_disposition: Optional[str] = Field(default="Hold / Quarantine", description="Disposition recommendation")
    next_recommended_action: Optional[str] = Field(default=None, description="Immediate next investigation or containment step")
    reasoning: Optional[str] = Field(default=None, description="Technical rationale based on ICH Q7/Q9")

# --- Evidence ---
class EvidenceItem(BaseModel):
    id: str
    description: str
    source: str  # e.g. "SCADA Trend Log", "HPLC Assay Report", "Operator Logsheet"
    category: Optional[str] = "Analytical"
    verified: bool = True

class MissingEvidenceItem(BaseModel):
    id: str
    gap: str
    priority: Literal["High", "Medium", "Low"] = "High"
    why_needed: str
    status: Literal["Pending", "Obtained"] = "Pending"

# --- 5 Whys ---
class FiveWhysStep(BaseModel):
    step: int
    question: str
    answer: str
    evidence: Optional[str] = None
    confidence: Literal["High", "Medium", "Low"] = "Medium"

# --- Fishbone (Ishikawa 6M) ---
class FishboneItem(BaseModel):
    id: str
    text: str
    is_root_cause: bool = False

class Fishbone6M(BaseModel):
    man: List[FishboneItem] = Field(default_factory=list)
    machine: List[FishboneItem] = Field(default_factory=list)
    method: List[FishboneItem] = Field(default_factory=list)
    material: List[FishboneItem] = Field(default_factory=list)
    measurement: List[FishboneItem] = Field(default_factory=list)
    environment: List[FishboneItem] = Field(default_factory=list)

# --- Root Cause Candidates ---
class RootCauseCandidate(BaseModel):
    id: str
    cause: str
    category: str
    likelihood: Literal["High", "Medium", "Low"] = "Medium"
    supporting_evidence: str
    classification: Literal["Probable Root Cause", "Contributing Factor"] = "Probable Root Cause"
    status: Literal["AI Suggested", "Confirmed", "Rejected"] = "AI Suggested"
    confirmed_by: Optional[str] = None
    confirmed_at: Optional[str] = None

# --- CAPA Recommendations ---
class CAPARecommendation(BaseModel):
    id: str
    type: Literal["Correction", "Corrective Action", "Preventive Action"] = "Corrective Action"
    action: str
    rationale: str
    linked_root_cause: str
    owner_role: str  # e.g. "Process Engineering Lead", "QA Validation Specialist"
    due_window: str  # e.g. "14 Days", "30 Days", "60 Days"
    effectiveness_check: str
    status: Literal["Suggested", "Accepted", "Rejected"] = "Suggested"

# --- Full Investigation State ---
class RCAInvestigationState(BaseModel):
    incident_details: IncidentDetails = Field(default_factory=IncidentDetails)
    risk_assessment: RiskAssessment = Field(default_factory=RiskAssessment)
    evidence_available: List[EvidenceItem] = Field(default_factory=list)
    missing_evidence: List[MissingEvidenceItem] = Field(default_factory=list)
    five_whys: List[FiveWhysStep] = Field(default_factory=list)
    fishbone: Fishbone6M = Field(default_factory=Fishbone6M)
    root_cause_candidates: List[RootCauseCandidate] = Field(default_factory=list)
    capa_recommendations: List[CAPARecommendation] = Field(default_factory=list)
    active_tab: str = "5whys"  # "5whys" | "fishbone"
    last_updated_fields: List[str] = Field(default_factory=list)

# --- Request / Response Models ---
class ChatMessage(BaseModel):
    id: str
    role: Literal["user", "assistant", "system"]
    content: str
    timestamp: str
    tool_badge: Optional[str] = None  # e.g. "Extraction", "Edit", "RCA Analysis", "CAPA Generation"

class ChatRequest(BaseModel):
    message: str
    current_state: RCAInvestigationState
    chat_history: Optional[List[ChatMessage]] = Field(default_factory=list)

class AIActionResponse(BaseModel):
    reply: str
    updated_state: RCAInvestigationState
    tool_used: str  # "Extraction", "Edit", "RCA Analysis", "CAPA Generation", "Chat"
    changed_fields: List[str] = Field(default_factory=list)

class SaveInvestigationRequest(BaseModel):
    id: Optional[str] = None
    title: Optional[str] = None
    status: Optional[str] = "IN_PROGRESS"
    state: RCAInvestigationState

class InvestigationSummary(BaseModel):
    id: str
    incident_id: Optional[str]
    title: str
    status: str
    created_at: str
    updated_at: str
