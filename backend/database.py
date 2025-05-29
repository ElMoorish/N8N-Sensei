"""
Database configuration and models for N8N-Sensei
"""

from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Boolean, JSON, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import uuid
from config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
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
    
    def __repr__(self):
        return f"<User(email='{self.email}', role='{self.role}')>"

class WorkflowTemplate(Base):
    __tablename__ = "workflow_templates"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, index=True)
    description = Column(Text)
    category = Column(String, index=True)
    n8n_workflow_id = Column(String, unique=True, index=True)
    template_data = Column(JSON)
    ai_generated = Column(Boolean, default=False)
    
    # Owner and marketplace info
    owner_id = Column(String, ForeignKey("users.id"))
    is_public = Column(Boolean, default=False)
    is_premium = Column(Boolean, default=False)
    price_usd = Column(Float, default=0.0)
    downloads = Column(Integer, default=0)
    rating = Column(Float, default=0.0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    owner = relationship("User")

class AIConversation(Base):
    __tablename__ = "ai_conversations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    user_message = Column(Text)
    ai_response = Column(Text)
    ai_provider = Column(String)  # llama, openai, anthropic, openrouter
    ai_model = Column(String)
    workflow_id = Column(String, nullable=True)
    action_taken = Column(String, nullable=True)  # created, modified, executed, etc.
    
    # Metrics
    response_time_ms = Column(Integer)
    tokens_used = Column(Integer)
    cost_usd = Column(Float)
    user_rating = Column(Integer)  # 1-5 stars
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User")

class WorkflowExecution(Base):
    __tablename__ = "workflow_executions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    n8n_execution_id = Column(String, unique=True, index=True)
    workflow_id = Column(String, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    status = Column(String)  # running, success, error, waiting
    ai_triggered = Column(Boolean, default=False)
    ai_parameters_filled = Column(Boolean, default=False)
    execution_data = Column(JSON)
    input_data = Column(JSON)
    output_data = Column(JSON)
    error_message = Column(Text)
    started_at = Column(DateTime)
    finished_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User")

async def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)

def init_database():
    """Initialize database with default data"""
    from auth import get_password_hash
    
    db = SessionLocal()
    try:
        # Create admin user if not exists
        admin_user = db.query(User).filter(User.email == "admin@n8n-sensei.com").first()
        if not admin_user:
            admin_user = User(
                email="admin@n8n-sensei.com",
                hashed_password=get_password_hash("admin123"),
                full_name="N8N-Sensei Admin",
                role="admin",
                subscription_tier="enterprise",
                api_quota_limit=10000
            )
            db.add(admin_user)
            db.commit()
            print("✅ Created admin user: admin@n8n-sensei.com / admin123")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error initializing database: {e}")
    finally:
        db.close()

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()