"""
Pydantic models for N8N-Sensei API
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum

class AIProvider(str, Enum):
    LLAMA = "llama"  # Local AI on LLama Docker Desktop
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    OPENROUTER = "openrouter"
    LM_STUDIO = "lm_studio"  # LM Studio local AI
    OLLAMA = "ollama"  # Ollama local AI

class WorkflowStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    ERROR = "error"

class ExecutionStatus(str, Enum):
    RUNNING = "running"
    SUCCESS = "success"
    ERROR = "error"
    WAITING = "waiting"

# Request Models
class ChatRequest(BaseModel):
    message: str = Field(..., description="User message to the AI")
    session_id: Optional[str] = Field(None, description="Session ID for conversation continuity")
    ai_provider: AIProvider = Field(AIProvider.LLAMA, description="AI provider to use")
    workflow_context: Optional[str] = Field(None, description="Current workflow context")

class WorkflowGenerateRequest(BaseModel):
    description: str = Field(..., description="Description of the workflow to generate")
    ai_provider: AIProvider = Field(AIProvider.LLAMA, description="AI provider to use")
    category: Optional[str] = Field("general", description="Workflow category")

class WorkflowOptimizeRequest(BaseModel):
    workflow_id: str = Field(..., description="N8N workflow ID to optimize")
    ai_provider: AIProvider = Field(AIProvider.LLAMA, description="AI provider to use")
    optimization_goals: Optional[List[str]] = Field(["performance", "reliability"], description="Optimization goals")

class ParameterFillRequest(BaseModel):
    workflow_id: str = Field(..., description="N8N workflow ID")
    context_data: Dict[str, Any] = Field(..., description="Context data for parameter filling")
    ai_provider: AIProvider = Field(AIProvider.LLAMA, description="AI provider to use")

# Response Models
class ChatResponse(BaseModel):
    response: str
    session_id: str
    ai_provider: str
    workflow_action: Optional[str] = None
    workflow_id: Optional[str] = None
    suggestions: Optional[List[str]] = None

class WorkflowResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    status: WorkflowStatus
    nodes: List[Dict[str, Any]]
    connections: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

class WorkflowGenerateResponse(BaseModel):
    workflow: WorkflowResponse
    ai_explanation: str
    confidence_score: float = Field(..., ge=0.0, le=1.0)

class ExecutionResponse(BaseModel):
    id: str
    workflow_id: str
    status: ExecutionStatus
    started_at: datetime
    finished_at: Optional[datetime]
    data: Optional[Dict[str, Any]]
    ai_triggered: bool = False

class HealthResponse(BaseModel):
    status: str
    version: str
    n8n_connected: bool
    ai_providers: Dict[str, bool]
    database_connected: bool

# Internal Models
class N8NWorkflow(BaseModel):
    id: str
    name: str
    active: bool
    nodes: List[Dict[str, Any]]
    connections: Dict[str, Any]
    createdAt: datetime
    updatedAt: datetime

class AIMessage(BaseModel):
    role: str  # user, assistant, system
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)