"""
N8N Service for N8N-Sensei - Handles all N8N API interactions
"""

import httpx
import json
from typing import Dict, Any, List, Optional
from config import settings
from models import N8NWorkflow, WorkflowStatus, ExecutionStatus
from datetime import datetime

class N8NService:
    def __init__(self):
        self.base_url = settings.n8n_base_url
        self.api_key = settings.N8N_API_KEY
        self.headers = {}
        
        if self.api_key:
            self.headers["X-N8N-API-KEY"] = self.api_key
    
    async def check_connection(self) -> bool:
        """Check if N8N is accessible"""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.base_url}/rest/active-workflows", headers=self.headers)
                return response.status_code == 200
        except Exception:
            return False
    
    async def get_workflows_count(self) -> int:
        """Get total number of workflows"""
        try:
            workflows = await self.get_workflows()
            return len(workflows)
        except Exception:
            return 0
    
    async def get_workflows(self) -> List[Dict[str, Any]]:
        """Get all workflows from N8N"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{self.base_url}/rest/workflows", headers=self.headers)
                
                if response.status_code == 200:
                    return response.json()
                else:
                    raise Exception(f"N8N API error: {response.status_code}")
        except Exception as e:
            raise Exception(f"Failed to get workflows: {str(e)}")
    
    async def get_workflow(self, workflow_id: str) -> Dict[str, Any]:
        """Get specific workflow by ID"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{self.base_url}/rest/workflows/{workflow_id}", headers=self.headers)
                
                if response.status_code == 200:
                    return response.json()
                else:
                    raise Exception(f"Workflow not found: {workflow_id}")
        except Exception as e:
            raise Exception(f"Failed to get workflow: {str(e)}")
    
    async def create_workflow(self, workflow_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create new workflow in N8N"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/rest/workflows",
                    headers=self.headers,
                    json=workflow_data
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    raise Exception(f"Failed to create workflow: {response.status_code}")
        except Exception as e:
            raise Exception(f"Failed to create workflow: {str(e)}")
    
    async def update_workflow(self, workflow_id: str, workflow_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update existing workflow"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.put(
                    f"{self.base_url}/rest/workflows/{workflow_id}",
                    headers=self.headers,
                    json=workflow_data
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    raise Exception(f"Failed to update workflow: {response.status_code}")
        except Exception as e:
            raise Exception(f"Failed to update workflow: {str(e)}")
    
    async def delete_workflow(self, workflow_id: str) -> bool:
        """Delete workflow"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.delete(f"{self.base_url}/rest/workflows/{workflow_id}", headers=self.headers)
                return response.status_code == 200
        except Exception:
            return False
    
    async def execute_workflow(self, workflow_id: str, input_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Execute workflow manually"""
        try:
            payload = {"workflowData": {"id": workflow_id}}
            if input_data:
                payload["inputData"] = input_data
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/rest/workflows/{workflow_id}/execute",
                    headers=self.headers,
                    json=payload
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    raise Exception(f"Failed to execute workflow: {response.status_code}")
        except Exception as e:
            raise Exception(f"Failed to execute workflow: {str(e)}")
    
    async def get_executions(self, workflow_id: Optional[str] = None, limit: int = 20) -> List[Dict[str, Any]]:
        """Get workflow executions"""
        try:
            params = {"limit": limit}
            if workflow_id:
                params["workflowId"] = workflow_id
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/rest/executions",
                    headers=self.headers,
                    params=params
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data.get("data", [])
                else:
                    raise Exception(f"Failed to get executions: {response.status_code}")
        except Exception as e:
            raise Exception(f"Failed to get executions: {str(e)}")
    
    async def get_execution(self, execution_id: str) -> Dict[str, Any]:
        """Get specific execution details"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{self.base_url}/rest/executions/{execution_id}", headers=self.headers)
                
                if response.status_code == 200:
                    return response.json()
                else:
                    raise Exception(f"Execution not found: {execution_id}")
        except Exception as e:
            raise Exception(f"Failed to get execution: {str(e)}")
    
    async def activate_workflow(self, workflow_id: str) -> bool:
        """Activate workflow"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(f"{self.base_url}/rest/workflows/{workflow_id}/activate", headers=self.headers)
                return response.status_code == 200
        except Exception:
            return False
    
    async def deactivate_workflow(self, workflow_id: str) -> bool:
        """Deactivate workflow"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(f"{self.base_url}/rest/workflows/{workflow_id}/deactivate", headers=self.headers)
                return response.status_code == 200
        except Exception:
            return False
    
    async def get_workflow_statistics(self, workflow_id: str) -> Dict[str, Any]:
        """Get workflow execution statistics"""
        try:
            executions = await self.get_executions(workflow_id, limit=100)
            
            total_executions = len(executions)
            successful = sum(1 for ex in executions if ex.get("finished") and not ex.get("stoppedAt"))
            failed = sum(1 for ex in executions if ex.get("stoppedAt"))
            running = sum(1 for ex in executions if not ex.get("finished") and not ex.get("stoppedAt"))
            
            return {
                "total_executions": total_executions,
                "successful": successful,
                "failed": failed,
                "running": running,
                "success_rate": (successful / total_executions * 100) if total_executions > 0 else 0
            }
        except Exception as e:
            return {
                "total_executions": 0,
                "successful": 0,
                "failed": 0,
                "running": 0,
                "success_rate": 0,
                "error": str(e)
            }
    
    async def analyze_workflow_for_ai(self, workflow_id: str) -> Dict[str, Any]:
        """Analyze workflow and prepare data for AI processing"""
        try:
            workflow = await self.get_workflow(workflow_id)
            stats = await self.get_workflow_statistics(workflow_id)
            recent_executions = await self.get_executions(workflow_id, limit=5)
            
            # Extract key information for AI analysis
            analysis = {
                "workflow": {
                    "id": workflow.get("id"),
                    "name": workflow.get("name"),
                    "active": workflow.get("active"),
                    "node_count": len(workflow.get("nodes", [])),
                    "connection_count": len(workflow.get("connections", {})),
                    "tags": workflow.get("tags", [])
                },
                "performance": stats,
                "recent_executions": recent_executions,
                "nodes": []
            }
            
            # Analyze nodes
            for node in workflow.get("nodes", []):
                node_info = {
                    "type": node.get("type"),
                    "name": node.get("name"),
                    "parameters": node.get("parameters", {}),
                    "position": node.get("position", [])
                }
                analysis["nodes"].append(node_info)
            
            return analysis
        except Exception as e:
            raise Exception(f"Failed to analyze workflow: {str(e)}")
    
    async def validate_workflow(self, workflow_data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate workflow structure"""
        validation_result = {
            "valid": True,
            "errors": [],
            "warnings": []
        }
        
        # Basic validation
        if not workflow_data.get("name"):
            validation_result["errors"].append("Workflow name is required")
            validation_result["valid"] = False
        
        if not workflow_data.get("nodes"):
            validation_result["errors"].append("Workflow must have at least one node")
            validation_result["valid"] = False
        
        # Check for required node properties
        for i, node in enumerate(workflow_data.get("nodes", [])):
            if not node.get("type"):
                validation_result["errors"].append(f"Node {i} is missing type")
                validation_result["valid"] = False
            
            if not node.get("name"):
                validation_result["warnings"].append(f"Node {i} is missing name")
        
        return validation_result