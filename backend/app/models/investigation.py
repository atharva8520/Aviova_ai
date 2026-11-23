from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, JSON
from app.database import Base

class Investigation(Base):
    __tablename__ = "investigations"

    id = Column(String, primary_key=True, index=True)
    incident_id = Column(String, index=True, nullable=True)
    title = Column(String, nullable=False, default="Untitled RCA Investigation")
    status = Column(String, default="IN_PROGRESS")  # IN_PROGRESS, UNDER_REVIEW, CLOSED
    data = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
