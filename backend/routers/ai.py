"""
AI integration endpoints for N8N-Sensei
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
from sqlalchemy.orm import Session
import uuid
from datetime import datetime

from models import (
    ChatRequest, ChatResponse, WorkflowGenerateRequest, WorkflowGenerateResponse,
    WorkflowOptimizeRequest, ParameterFillRequest, AIProvider
)
from services.ai_service import AIService
from services.n8n_service import N8NService
from database import get_db, AIConversation

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Chat with AI about workflows and automation
    """
    try:
        ai_service = AIService()
        
        # Generate session ID if not provided
        session_id = request.session_id or str(uuid.uuid4())
        
        # Get AI response
        response = await ai_service.chat(
            message=request.message,
            provider=request.ai_provider,
            context=request.workflow_context
        )
        
        # Save conversation to database
        conversation = AIConversation(
            session_id=session_id,
            user_message=request.message,
            ai_response=response,
            ai_provider=request.ai_provider.value,
            workflow_id=request.workflow_context,
            created_at=datetime.utcnow()
        )
        db.add(conversation)
        db.commit()
        
        # Analyze response for workflow actions
        workflow_action = None
        workflow_id = None
        suggestions = []
        
        # Simple keyword detection for workflow actions
        response_lower = response.lower()
        if "create workflow" in response_lower or "generate workflow" in response_lower:
            workflow_action = "create_suggested"
            suggestions.append("Would you like me to generate this workflow for you?")
        elif "modify workflow" in response_lower or "update workflow" in response_lower:
            workflow_action = "modify_suggested"
            suggestions.append("I can help you modify the workflow. Please provide the workflow ID.")
        elif "execute workflow" in response_lower or "run workflow" in response_lower:
            workflow_action = "execute_suggested"
            suggestions.append("I can execute this workflow for you. Please confirm.")
        
        return ChatResponse(
            response=response,
            session_id=session_id,
            ai_provider=request.ai_provider.value,
            workflow_action=workflow_action,
            workflow_id=workflow_id,
            suggestions=suggestions
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@router.post("/generate-workflow", response_model=WorkflowGenerateResponse)
async def generate_workflow(request: WorkflowGenerateRequest, db: Session = Depends(get_db)):
    """
    Generate N8N workflow from natural language description
    """
    try:
        ai_service = AIService()
        n8n_service = N8NService()
        
        # Generate workflow using AI
        workflow_data = await ai_service.generate_workflow(
            description=request.description,
            provider=request.ai_provider
        )
        
        # Extract AI explanation if present
        ai_explanation = workflow_data.pop("ai_explanation", "Workflow generated successfully")
        
        # Validate generated workflow
        validation = await n8n_service.validate_workflow(workflow_data)
        confidence_score = 0.8 if validation["valid"] else 0.3
        
        if validation["valid"]:
            # Create workflow in N8N
            created_workflow = await n8n_service.create_workflow(workflow_data)
            
            # Save conversation
            conversation = AIConversation(
                session_id=str(uuid.uuid4()),
                user_message=f"Generate workflow: {request.description}",
                ai_response=ai_explanation,
                ai_provider=request.ai_provider.value,
                workflow_id=created_workflow["id"],
                action_taken="workflow_created",
                created_at=datetime.utcnow()
            )
            db.add(conversation)
            db.commit()
            
            return WorkflowGenerateResponse(
                workflow=created_workflow,
                ai_explanation=ai_explanation,
                confidence_score=confidence_score
            )
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Generated workflow is invalid: {validation['errors']}"
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Workflow generation failed: {str(e)}")

@router.post("/optimize-workflow")
async def optimize_workflow(request: WorkflowOptimizeRequest, db: Session = Depends(get_db)):
    """
    Optimize existing workflow using AI
    """
    try:
        ai_service = AIService()
        n8n_service = N8NService()
        
        # Get current workflow
        workflow = await n8n_service.get_workflow(request.workflow_id)
        analysis = await n8n_service.analyze_workflow_for_ai(request.workflow_id)
        
        # Create optimization prompt
        optimization_prompt = f"""
        Analyze and optimize this N8N workflow:
        
        Workflow: {workflow['name']}
        Current Performance: {analysis['performance']}
        Nodes: {len(analysis['nodes'])} nodes
        
        Optimization Goals: {', '.join(request.optimization_goals)}
        
        Current Workflow Structure:
        {workflow}
        
        Please provide:
        1. Specific optimization recommendations
        2. Updated workflow JSON (if changes needed)
        3. Expected performance improvements
        4. Risk assessment of changes
        """
        
        # Get AI optimization suggestions
        optimization_response = await ai_service.chat(
            message=optimization_prompt,
            provider=request.ai_provider,
            context=f"Optimizing workflow {request.workflow_id}"
        )
        
        # Save conversation
        conversation = AIConversation(
            session_id=str(uuid.uuid4()),
            user_message=f"Optimize workflow {request.workflow_id}",
            ai_response=optimization_response,
            ai_provider=request.ai_provider.value,
            workflow_id=request.workflow_id,
            action_taken="workflow_optimized",
            created_at=datetime.utcnow()
        )
        db.add(conversation)
        db.commit()
        
        return {
            "workflow_id": request.workflow_id,
            "optimization_suggestions": optimization_response,
            "current_performance": analysis['performance'],
            "ai_provider": request.ai_provider.value
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Workflow optimization failed: {str(e)}")

@router.post("/fill-parameters")
async def fill_workflow_parameters(request: ParameterFillRequest, db: Session = Depends(get_db)):
    """
    Intelligently fill workflow parameters using AI
    """
    try:
        ai_service = AIService()
        n8n_service = N8NService()
        
        # Get workflow details
        workflow = await n8n_service.get_workflow(request.workflow_id)
        
        # Create parameter filling prompt
        parameter_prompt = f"""
        Fill in the missing parameters for this N8N workflow based on the provided context:
        
        Workflow: {workflow['name']}
        Context Data: {request.context_data}
        
        Workflow Nodes:
        {workflow.get('nodes', [])}
        
        Please analyze each node and suggest appropriate parameter values based on the context.
        Return a JSON object with node IDs as keys and parameter suggestions as values.
        
        Example format:
        {{
            "node_id_1": {{
                "parameter_name": "suggested_value",
                "another_parameter": "another_value"
            }},
            "node_id_2": {{
                "parameter_name": "suggested_value"
            }}
        }}
        """
        
        # Get AI parameter suggestions
        parameter_response = await ai_service.chat(
            message=parameter_prompt,
            provider=request.ai_provider,
            context=f"Filling parameters for workflow {request.workflow_id}"
        )
        
        # Save conversation
        conversation = AIConversation(
            session_id=str(uuid.uuid4()),
            user_message=f"Fill parameters for workflow {request.workflow_id}",
            ai_response=parameter_response,
            ai_provider=request.ai_provider.value,
            workflow_id=request.workflow_id,
            action_taken="parameters_filled",
            created_at=datetime.utcnow()
        )
        db.add(conversation)
        db.commit()
        
        return {
            "workflow_id": request.workflow_id,
            "parameter_suggestions": parameter_response,
            "context_used": request.context_data,
            "ai_provider": request.ai_provider.value
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parameter filling failed: {str(e)}")

@router.get("/conversation-history/{session_id}")
async def get_conversation_history(session_id: str, db: Session = Depends(get_db)):
    """
    Get conversation history for a session
    """
    try:
        conversations = db.query(AIConversation).filter(
            AIConversation.session_id == session_id
        ).order_by(AIConversation.created_at).all()
        
        return [
            {
                "id": conv.id,
                "user_message": conv.user_message,
                "ai_response": conv.ai_response,
                "ai_provider": conv.ai_provider,
                "workflow_id": conv.workflow_id,
                "action_taken": conv.action_taken,
                "created_at": conv.created_at
            }
            for conv in conversations
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get conversation history: {str(e)}")

@router.post("/explain-workflow/{workflow_id}")
async def explain_workflow(workflow_id: str, ai_provider: AIProvider = AIProvider.LLAMA):
    """
    Get AI explanation of a workflow
    """
    try:
        ai_service = AIService()
        n8n_service = N8NService()
        
        # Get workflow and analysis
        workflow = await n8n_service.get_workflow(workflow_id)
        analysis = await n8n_service.analyze_workflow_for_ai(workflow_id)
        
        # Create explanation prompt
        explanation_prompt = f"""
        Explain this N8N workflow in simple terms:
        
        Workflow Name: {workflow['name']}
        Number of Nodes: {len(analysis['nodes'])}
        Performance Stats: {analysis['performance']}
        
        Workflow Structure:
        {workflow}
        
        Please provide:
        1. What this workflow does (purpose)
        2. How it works (step-by-step)
        3. Key benefits and use cases
        4. Any potential improvements
        """
        
        # Get AI explanation
        explanation = await ai_service.chat(
            message=explanation_prompt,
            provider=ai_provider,
            context=f"Explaining workflow {workflow_id}"
        )
        
        return {
            "workflow_id": workflow_id,
            "workflow_name": workflow['name'],
            "explanation": explanation,
            "analysis": analysis,
            "ai_provider": ai_provider.value
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Workflow explanation failed: {str(e)}")

@router.get("/providers/status")
async def get_ai_providers_status():
    """
    Get status of all AI providers
    """
    try:
        ai_service = AIService()
        providers = await ai_service.check_all_providers()
        
        return {
            "providers": providers,
            "available_count": sum(1 for available in providers.values() if available),
            "total_count": len(providers),
            "recommended": "llama" if providers.get("llama") else next((k for k, v in providers.items() if v), None)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get provider status: {str(e)}")