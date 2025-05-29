"""
Database configuration and models for N8N-Sensei
"""

from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class WorkflowTemplate(Base):
    __tablename__ = "workflow_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    category = Column(String, index=True)
    n8n_workflow_id = Column(String, unique=True, index=True)
    template_data = Column(JSON)
    ai_generated = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class AIConversation(Base):
    __tablename__ = "ai_conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    user_message = Column(Text)
    ai_response = Column(Text)
    ai_provider = Column(String)  # llama, openai, anthropic, openrouter
    workflow_id = Column(String, nullable=True)
    action_taken = Column(String, nullable=True)  # created, modified, executed, etc.
    created_at = Column(DateTime, default=datetime.utcnow)

class WorkflowExecution(Base):
    __tablename__ = "workflow_executions"
    
    id = Column(Integer, primary_key=True, index=True)
    n8n_execution_id = Column(String, unique=True, index=True)
    workflow_id = Column(String, index=True)
    status = Column(String)  # running, success, error, waiting
    ai_triggered = Column(Boolean, default=False)
    execution_data = Column(JSON)
    started_at = Column(DateTime)
    finished_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

async def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()