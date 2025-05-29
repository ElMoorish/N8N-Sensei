"""
Workflow management endpoints for N8N-Sensei
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session

from models import WorkflowResponse, ExecutionResponse, WorkflowStatus
from services.n8n_service import N8NService
from database import get_db

router = APIRouter()

@router.get("/", response_model=List[WorkflowResponse])
async def get_workflows(
    active_only: bool = Query(False, description="Filter only active workflows"),
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = Query(50, description="Maximum number of workflows to return")
):
    """
    Get all workflows from N8N with optional filtering
    """
    try:
        n8n_service = N8NService()
        workflows = await n8n_service.get_workflows()
        
        # Apply filters
        if active_only:
            workflows = [w for w in workflows if w.get("active", False)]
        
        # Convert to response format
        workflow_responses = []
        for workflow in workflows[:limit]:
            workflow_response = WorkflowResponse(
                id=workflow["id"],
                name=workflow["name"],
                description=workflow.get("meta", {}).get("description", ""),
                status=WorkflowStatus.ACTIVE if workflow.get("active") else WorkflowStatus.INACTIVE,
                nodes=workflow.get("nodes", []),
                connections=workflow.get("connections", {}),
                created_at=workflow.get("createdAt"),
                updated_at=workflow.get("updatedAt")
            )
            workflow_responses.append(workflow_response)
        
        return workflow_responses
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get workflows: {str(e)}")

@router.get("/{workflow_id}", response_model=WorkflowResponse)
async def get_workflow(workflow_id: str):
    """
    Get specific workflow by ID
    """
    try:
        n8n_service = N8NService()
        workflow = await n8n_service.get_workflow(workflow_id)
        
        return WorkflowResponse(
            id=workflow["id"],
            name=workflow["name"],
            description=workflow.get("meta", {}).get("description", ""),
            status=WorkflowStatus.ACTIVE if workflow.get("active") else WorkflowStatus.INACTIVE,
            nodes=workflow.get("nodes", []),
            connections=workflow.get("connections", {}),
            created_at=workflow.get("createdAt"),
            updated_at=workflow.get("updatedAt")
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Workflow not found: {str(e)}")

@router.post("/", response_model=WorkflowResponse)
async def create_workflow(workflow_data: Dict[str, Any]):
    """
    Create new workflow in N8N
    """
    try:
        n8n_service = N8NService()
        
        # Validate workflow
        validation = await n8n_service.validate_workflow(workflow_data)
        if not validation["valid"]:
            raise HTTPException(status_code=400, detail=f"Invalid workflow: {validation['errors']}")
        
        # Create workflow
        created_workflow = await n8n_service.create_workflow(workflow_data)
        
        return WorkflowResponse(
            id=created_workflow["id"],
            name=created_workflow["name"],
            description=created_workflow.get("meta", {}).get("description", ""),
            status=WorkflowStatus.ACTIVE if created_workflow.get("active") else WorkflowStatus.INACTIVE,
            nodes=created_workflow.get("nodes", []),
            connections=created_workflow.get("connections", {}),
            created_at=created_workflow.get("createdAt"),
            updated_at=created_workflow.get("updatedAt")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create workflow: {str(e)}")

@router.put("/{workflow_id}", response_model=WorkflowResponse)
async def update_workflow(workflow_id: str, workflow_data: Dict[str, Any]):
    """
    Update existing workflow
    """
    try:
        n8n_service = N8NService()
        
        # Validate workflow
        validation = await n8n_service.validate_workflow(workflow_data)
        if not validation["valid"]:
            raise HTTPException(status_code=400, detail=f"Invalid workflow: {validation['errors']}")
        
        # Update workflow
        updated_workflow = await n8n_service.update_workflow(workflow_id, workflow_data)
        
        return WorkflowResponse(
            id=updated_workflow["id"],
            name=updated_workflow["name"],
            description=updated_workflow.get("meta", {}).get("description", ""),
            status=WorkflowStatus.ACTIVE if updated_workflow.get("active") else WorkflowStatus.INACTIVE,
            nodes=updated_workflow.get("nodes", []),
            connections=updated_workflow.get("connections", {}),
            created_at=updated_workflow.get("createdAt"),
            updated_at=updated_workflow.get("updatedAt")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update workflow: {str(e)}")

@router.delete("/{workflow_id}")
async def delete_workflow(workflow_id: str):
    """
    Delete workflow
    """
    try:
        n8n_service = N8NService()
        success = await n8n_service.delete_workflow(workflow_id)
        
        if success:
            return {"message": "Workflow deleted successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to delete workflow")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete workflow: {str(e)}")

@router.post("/{workflow_id}/execute", response_model=ExecutionResponse)
async def execute_workflow(workflow_id: str, input_data: Optional[Dict[str, Any]] = None):
    """
    Execute workflow manually
    """
    try:
        n8n_service = N8NService()
        execution = await n8n_service.execute_workflow(workflow_id, input_data)
        
        return ExecutionResponse(
            id=execution["data"]["executionId"],
            workflow_id=workflow_id,
            status=ExecutionStatus.RUNNING,
            started_at=execution["data"]["startedAt"],
            finished_at=None,
            data=execution.get("data"),
            ai_triggered=False
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to execute workflow: {str(e)}")

@router.post("/{workflow_id}/activate")
async def activate_workflow(workflow_id: str):
    """
    Activate workflow
    """
    try:
        n8n_service = N8NService()
        success = await n8n_service.activate_workflow(workflow_id)
        
        if success:
            return {"message": "Workflow activated successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to activate workflow")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to activate workflow: {str(e)}")

@router.post("/{workflow_id}/deactivate")
async def deactivate_workflow(workflow_id: str):
    """
    Deactivate workflow
    """
    try:
        n8n_service = N8NService()
        success = await n8n_service.deactivate_workflow(workflow_id)
        
        if success:
            return {"message": "Workflow deactivated successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to deactivate workflow")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to deactivate workflow: {str(e)}")

@router.get("/{workflow_id}/executions", response_model=List[ExecutionResponse])
async def get_workflow_executions(
    workflow_id: str,
    limit: int = Query(20, description="Maximum number of executions to return")
):
    """
    Get workflow execution history
    """
    try:
        n8n_service = N8NService()
        executions = await n8n_service.get_executions(workflow_id, limit)
        
        execution_responses = []
        for execution in executions:
            execution_response = ExecutionResponse(
                id=execution["id"],
                workflow_id=workflow_id,
                status=ExecutionStatus.SUCCESS if execution.get("finished") and not execution.get("stoppedAt") else ExecutionStatus.ERROR,
                started_at=execution.get("startedAt"),
                finished_at=execution.get("stoppedAt"),
                data=execution.get("data"),
                ai_triggered=False  # Will be enhanced to track AI-triggered executions
            )
            execution_responses.append(execution_response)
        
        return execution_responses
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get executions: {str(e)}")

@router.get("/{workflow_id}/statistics")
async def get_workflow_statistics(workflow_id: str):
    """
    Get workflow performance statistics
    """
    try:
        n8n_service = N8NService()
        stats = await n8n_service.get_workflow_statistics(workflow_id)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get statistics: {str(e)}")

@router.get("/{workflow_id}/analyze")
async def analyze_workflow(workflow_id: str):
    """
    Analyze workflow for AI processing
    """
    try:
        n8n_service = N8NService()
        analysis = await n8n_service.analyze_workflow_for_ai(workflow_id)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze workflow: {str(e)}")