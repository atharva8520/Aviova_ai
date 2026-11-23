import uuid
from datetime import datetime
from typing import List, Optional
import logging

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db, init_db
from app.models.investigation import Investigation
from app.schemas.investigation import (
    RCAInvestigationState,
    ChatRequest,
    AIActionResponse,
    SaveInvestigationRequest,
    InvestigationSummary
)
from app.services.document_parser import extract_text_from_file
from app.services.ai_graph import execute_ai_workflow
from app.sample_data.samples import get_sample_investigation_state_1, SAMPLE_INCIDENT_TEXT_1

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("aviova")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-grade AI Root Cause Analysis (RCA) Copilot for API Pharmaceutical Manufacturing"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    logger.info("Initializing database tables...")
    try:
        init_db()
        logger.info("Database initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "groq_model": settings.GROQ_MODEL,
        "groq_fallback_model": settings.GROQ_FALLBACK_MODEL,
        "groq_api_configured": bool(settings.GROQ_API_KEY)
    }

@app.get("/api/v1/sample")
def get_sample_data():
    return {
        "state": get_sample_investigation_state_1(),
        "raw_text": SAMPLE_INCIDENT_TEXT_1
    }

@app.post("/api/v1/chat", response_model=AIActionResponse)
def handle_chat_endpoint(req: ChatRequest):
    try:
        res = execute_ai_workflow(
            message=req.message,
            current_state=req.current_state
        )
        return res
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/upload", response_model=AIActionResponse)
async def handle_upload_endpoint(
    file: UploadFile = File(...),
    state_json: str = Form(...)
):
    try:
        import json
        state_dict = json.loads(state_json)
        current_state = RCAInvestigationState(**state_dict)
        
        content = await file.read()
        extracted_text, file_type = extract_text_from_file(file.filename, content)
        
        logger.info(f"Extracted {len(extracted_text)} chars from {file.filename} ({file_type})")
        
        res = execute_ai_workflow(
            message=f"Extract investigation data from uploaded document: {file.filename}",
            current_state=current_state,
            uploaded_text=extracted_text
        )
        return res
    except Exception as e:
        logger.error(f"Error in upload endpoint: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to process uploaded file: {e}")

@app.post("/api/v1/investigations")
def save_investigation(req: SaveInvestigationRequest, db: Session = Depends(get_db)):
    try:
        inv_id = req.id or str(uuid.uuid4())
        inc_id = req.state.incident_details.incident_id
        title = req.title or req.state.incident_details.title or "Untitled RCA Investigation"
        
        # Check if exists
        existing = db.query(Investigation).filter(Investigation.id == inv_id).first()
        if existing:
            existing.title = title
            existing.incident_id = inc_id
            existing.status = req.status
            existing.data = req.state.model_dump()
            existing.updated_at = datetime.utcnow()
            db.commit()
            db.refresh(existing)
            return {"id": existing.id, "message": "Investigation updated successfully", "updated_at": existing.updated_at.isoformat()}
        else:
            new_inv = Investigation(
                id=inv_id,
                incident_id=inc_id,
                title=title,
                status=req.status,
                data=req.state.model_dump(),
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.add(new_inv)
            db.commit()
            db.refresh(new_inv)
            return {"id": new_inv.id, "message": "Investigation saved successfully", "created_at": new_inv.created_at.isoformat()}
    except Exception as e:
        logger.error(f"Failed to save investigation: {e}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/investigations", response_model=List[InvestigationSummary])
def list_investigations(db: Session = Depends(get_db)):
    try:
        invs = db.query(Investigation).order_by(Investigation.updated_at.desc()).all()
        return [
            InvestigationSummary(
                id=inv.id,
                incident_id=inv.incident_id,
                title=inv.title,
                status=inv.status,
                created_at=inv.created_at.isoformat() if inv.created_at else "",
                updated_at=inv.updated_at.isoformat() if inv.updated_at else ""
            )
            for inv in invs
        ]
    except Exception as e:
        logger.error(f"Failed to list investigations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/investigations/{id}")
def get_investigation(id: str, db: Session = Depends(get_db)):
    inv = db.query(Investigation).filter(Investigation.id == id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")
    return {
        "id": inv.id,
        "incident_id": inv.incident_id,
        "title": inv.title,
        "status": inv.status,
        "state": inv.data,
        "created_at": inv.created_at.isoformat() if inv.created_at else "",
        "updated_at": inv.updated_at.isoformat() if inv.updated_at else ""
    }

@app.delete("/api/v1/investigations/{id}")
def delete_investigation(id: str, db: Session = Depends(get_db)):
    inv = db.query(Investigation).filter(Investigation.id == id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")
    db.delete(inv)
    db.commit()
    return {"message": "Investigation deleted successfully", "id": id}
