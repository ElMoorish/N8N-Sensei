"""
N8N-Sensei SQLAlchemy Database Models
Database models for the N8N-Sensei application
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, JSON, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()

class User(Base):
    """User model for authentication and authorization."""
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="user")  # user, premium, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Subscription info for SaaS
    subscription_tier = Column(String, default="free")  # free, basic, premium, enterprise
    subscription_expires = Column(DateTime, nullable=True)
    api_quota_used = Column(Integer, default=0)
    api_quota_limit = Column(Integer, default=100)
    
    # Relationships
    workflows = relationship("Workflow", back_populates="owner")
    ai_interactions = relationship("AIInteraction", back_populates="user")
    
    def __repr__(self):
        return f"<User(email='{self.email}', role='{self.role}')>"

class Workflow(Base):
    """Workflow model for storing N8N workflow metadata."""
    __tablename__ = "workflows"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    n8n_workflow_id = Column(String, unique=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    category = Column(String, default="general")
    status = Column(String, default="active")  # active, inactive, error
    
    # AI-related fields
    ai_generated = Column(Boolean, default=False)
    ai_provider_used = Column(String)
    ai_confidence_score = Column(Float)
    ai_explanation = Column(Text)
    
    # Workflow data
    nodes = Column(JSON)
    connections = Column(JSON)
    settings = Column(JSON)
    
    # Ownership and timestamps
    owner_id = Column(String, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    owner = relationship("User", back_populates="workflows")
    executions = relationship("WorkflowExecution", back_populates="workflow")
    
    def __repr__(self):
        return f"<Workflow(name='{self.name}', status='{self.status}')>"

class WorkflowExecution(Base):
    """Workflow execution history."""
    __tablename__ = "workflow_executions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    n8n_execution_id = Column(String, unique=True, index=True)
    workflow_id = Column(String, ForeignKey("workflows.id"))
    
    status = Column(String)  # running, success, error, waiting
    started_at = Column(DateTime, default=datetime.utcnow)
    finished_at = Column(DateTime, nullable=True)
    
    # Execution data
    input_data = Column(JSON)
    output_data = Column(JSON)
    error_message = Column(Text)
    
    # AI involvement
    ai_triggered = Column(Boolean, default=False)
    ai_parameters_filled = Column(Boolean, default=False)
    
    # Relationships
    workflow = relationship("Workflow", back_populates="executions")
    
    def __repr__(self):
        return f"<WorkflowExecution(id='{self.id}', status='{self.status}')>"

class AIInteraction(Base):
    """AI interaction history for analytics and improvement."""
    __tablename__ = "ai_interactions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    session_id = Column(String, index=True)
    
    # Interaction details
    interaction_type = Column(String)  # chat, generate, optimize, analyze
    provider = Column(String)
    model = Column(String)
    
    # Request and response
    request_data = Column(JSON)
    response_data = Column(JSON)
    
    # Metrics
    response_time_ms = Column(Integer)
    tokens_used = Column(Integer)
    cost_usd = Column(Float)
    
    # Quality metrics
    user_rating = Column(Integer)  # 1-5 stars
    user_feedback = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="ai_interactions")
    
    def __repr__(self):
        return f"<AIInteraction(type='{self.interaction_type}', provider='{self.provider}')>"

class WorkflowTemplate(Base):
    """Pre-built workflow templates for the marketplace."""
    __tablename__ = "workflow_templates"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    description = Column(Text)
    category = Column(String)
    tags = Column(JSON)  # List of tags
    
    # Template data
    template_data = Column(JSON)  # N8N workflow structure
    parameters = Column(JSON)  # Configurable parameters
    
    # Marketplace info
    is_public = Column(Boolean, default=False)
    is_premium = Column(Boolean, default=False)
    price_usd = Column(Float, default=0.0)
    downloads = Column(Integer, default=0)
    rating = Column(Float, default=0.0)
    
    # Creator info
    creator_id = Column(String, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<WorkflowTemplate(name='{self.name}', category='{self.category}')>"

class APIUsage(Base):
    """API usage tracking for billing and analytics."""
    __tablename__ = "api_usage"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    
    # Usage details
    endpoint = Column(String)
    method = Column(String)
    status_code = Column(Integer)
    
    # AI-specific usage
    ai_provider = Column(String)
    ai_model = Column(String)
    tokens_used = Column(Integer)
    cost_usd = Column(Float)
    
    # Timing
    response_time_ms = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<APIUsage(endpoint='{self.endpoint}', user_id='{self.user_id}')>"

class SystemSettings(Base):
    """System-wide settings and configuration."""
    __tablename__ = "system_settings"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    key = Column(String, unique=True, nullable=False)
    value = Column(JSON)
    description = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<SystemSettings(key='{self.key}')>"