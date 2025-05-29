"""
N8N-Sensei Workflow API Tests
Tests for workflow management functionality
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

def test_get_workflows_empty(client: TestClient):
    """Test getting workflows when none exist."""
    response = client.get("/api/workflows")
    assert response.status_code == 200
    assert response.json() == []

@patch('services.n8n_service.N8NService.get_workflows')
def test_get_workflows_success(mock_get_workflows, client: TestClient, sample_workflow):
    """Test successful workflow retrieval."""
    mock_get_workflows.return_value = [sample_workflow]
    
    response = client.get("/api/workflows")
    assert response.status_code == 200
    
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Test Workflow"

@patch('services.n8n_service.N8NService.create_workflow')
def test_create_workflow_success(mock_create_workflow, client: TestClient, sample_workflow):
    """Test successful workflow creation."""
    mock_create_workflow.return_value = {"id": "123", **sample_workflow}
    
    response = client.post("/api/workflows", json=sample_workflow)
    assert response.status_code == 201
    
    data = response.json()
    assert data["id"] == "123"
    assert data["name"] == "Test Workflow"

def test_create_workflow_invalid_data(client: TestClient):
    """Test workflow creation with invalid data."""
    invalid_workflow = {"invalid": "data"}
    
    response = client.post("/api/workflows", json=invalid_workflow)
    assert response.status_code == 422

@patch('services.n8n_service.N8NService.get_workflow')
def test_get_workflow_by_id_success(mock_get_workflow, client: TestClient, sample_workflow):
    """Test getting a specific workflow by ID."""
    mock_get_workflow.return_value = {"id": "123", **sample_workflow}
    
    response = client.get("/api/workflows/123")
    assert response.status_code == 200
    
    data = response.json()
    assert data["id"] == "123"
    assert data["name"] == "Test Workflow"

@patch('services.n8n_service.N8NService.get_workflow')
def test_get_workflow_by_id_not_found(mock_get_workflow, client: TestClient):
    """Test getting a workflow that doesn't exist."""
    mock_get_workflow.return_value = None
    
    response = client.get("/api/workflows/nonexistent")
    assert response.status_code == 404

@patch('services.n8n_service.N8NService.update_workflow')
def test_update_workflow_success(mock_update_workflow, client: TestClient, sample_workflow):
    """Test successful workflow update."""
    updated_workflow = {**sample_workflow, "name": "Updated Workflow"}
    mock_update_workflow.return_value = {"id": "123", **updated_workflow}
    
    response = client.put("/api/workflows/123", json=updated_workflow)
    assert response.status_code == 200
    
    data = response.json()
    assert data["name"] == "Updated Workflow"

@patch('services.n8n_service.N8NService.delete_workflow')
def test_delete_workflow_success(mock_delete_workflow, client: TestClient):
    """Test successful workflow deletion."""
    mock_delete_workflow.return_value = True
    
    response = client.delete("/api/workflows/123")
    assert response.status_code == 204

@patch('services.n8n_service.N8NService.execute_workflow')
def test_execute_workflow_success(mock_execute_workflow, client: TestClient):
    """Test successful workflow execution."""
    mock_execute_workflow.return_value = {
        "execution_id": "exec_123",
        "status": "running"
    }
    
    response = client.post("/api/workflows/123/execute")
    assert response.status_code == 200
    
    data = response.json()
    assert data["execution_id"] == "exec_123"
    assert data["status"] == "running"

@patch('services.n8n_service.N8NService.get_workflow_executions')
def test_get_workflow_executions(mock_get_executions, client: TestClient):
    """Test getting workflow execution history."""
    mock_executions = [
        {"id": "exec_1", "status": "success", "startedAt": "2024-01-01T00:00:00Z"},
        {"id": "exec_2", "status": "failed", "startedAt": "2024-01-02T00:00:00Z"}
    ]
    mock_get_executions.return_value = mock_executions
    
    response = client.get("/api/workflows/123/executions")
    assert response.status_code == 200
    
    data = response.json()
    assert len(data) == 2
    assert data[0]["id"] == "exec_1"
    assert data[1]["status"] == "failed"