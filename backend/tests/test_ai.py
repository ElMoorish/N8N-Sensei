"""
N8N-Sensei AI API Tests
Tests for AI integration functionality
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

def test_ai_chat_invalid_request(client: TestClient):
    """Test AI chat with invalid request data."""
    response = client.post("/api/ai/chat", json={})
    assert response.status_code == 422

@patch('services.ai_service.AIService.chat')
def test_ai_chat_success(mock_chat, client: TestClient, sample_ai_request):
    """Test successful AI chat interaction."""
    mock_response = {
        "response": "I'll help you create a workflow that sends an email when a webhook is triggered.",
        "provider": "ollama",
        "model": "llama2",
        "usage": {"tokens": 150}
    }
    mock_chat.return_value = mock_response
    
    response = client.post("/api/ai/chat", json=sample_ai_request)
    assert response.status_code == 200
    
    data = response.json()
    assert "response" in data
    assert data["provider"] == "ollama"
    assert data["model"] == "llama2"

@patch('services.ai_service.AIService.generate_workflow')
def test_generate_workflow_success(mock_generate, client: TestClient, sample_workflow):
    """Test successful AI workflow generation."""
    mock_generate.return_value = {
        "workflow": sample_workflow,
        "explanation": "This workflow triggers on webhook and sends email",
        "confidence": 0.95
    }
    
    request_data = {
        "description": "Create a workflow that sends email on webhook trigger",
        "provider": "ollama",
        "model": "llama2"
    }
    
    response = client.post("/api/ai/generate-workflow", json=request_data)
    assert response.status_code == 200
    
    data = response.json()
    assert "workflow" in data
    assert "explanation" in data
    assert data["confidence"] == 0.95

@patch('services.ai_service.AIService.optimize_workflow')
def test_optimize_workflow_success(mock_optimize, client: TestClient, sample_workflow):
    """Test successful AI workflow optimization."""
    optimized_workflow = {
        **sample_workflow,
        "name": "Optimized Test Workflow"
    }
    
    mock_optimize.return_value = {
        "optimized_workflow": optimized_workflow,
        "improvements": ["Added error handling", "Optimized node connections"],
        "performance_gain": "25%"
    }
    
    request_data = {
        "workflow": sample_workflow,
        "optimization_goals": ["performance", "reliability"]
    }
    
    response = client.post("/api/ai/optimize-workflow", json=request_data)
    assert response.status_code == 200
    
    data = response.json()
    assert "optimized_workflow" in data
    assert "improvements" in data
    assert data["performance_gain"] == "25%"

@patch('services.ai_service.AIService.analyze_workflow')
def test_analyze_workflow_success(mock_analyze, client: TestClient, sample_workflow):
    """Test successful AI workflow analysis."""
    mock_analyze.return_value = {
        "complexity_score": 3,
        "potential_issues": ["Missing error handling"],
        "suggestions": ["Add try-catch nodes", "Implement retry logic"],
        "performance_metrics": {
            "estimated_execution_time": "2.5s",
            "resource_usage": "low"
        }
    }
    
    response = client.post("/api/ai/analyze-workflow", json={"workflow": sample_workflow})
    assert response.status_code == 200
    
    data = response.json()
    assert "complexity_score" in data
    assert "potential_issues" in data
    assert "suggestions" in data
    assert data["complexity_score"] == 3

def test_get_ai_providers(client: TestClient):
    """Test getting available AI providers."""
    response = client.get("/api/ai/providers")
    assert response.status_code == 200
    
    data = response.json()
    assert isinstance(data, list)
    
    # Check for expected providers
    provider_names = [provider["name"] for provider in data]
    expected_providers = ["ollama", "lm_studio", "openai", "anthropic", "openrouter"]
    
    for provider in expected_providers:
        assert provider in provider_names

@patch('services.ai_service.AIService.get_models')
def test_get_ai_models(mock_get_models, client: TestClient):
    """Test getting available AI models for a provider."""
    mock_models = [
        {"name": "llama2", "size": "7B", "type": "chat"},
        {"name": "codellama", "size": "13B", "type": "code"}
    ]
    mock_get_models.return_value = mock_models
    
    response = client.get("/api/ai/providers/ollama/models")
    assert response.status_code == 200
    
    data = response.json()
    assert len(data) == 2
    assert data[0]["name"] == "llama2"
    assert data[1]["name"] == "codellama"

@patch('services.ai_service.AIService.test_connection')
def test_test_ai_provider_connection(mock_test, client: TestClient):
    """Test AI provider connection."""
    mock_test.return_value = {
        "status": "connected",
        "response_time": 150,
        "model_info": {"name": "llama2", "version": "latest"}
    }
    
    response = client.post("/api/ai/test-connection", json={
        "provider": "ollama",
        "model": "llama2"
    })
    assert response.status_code == 200
    
    data = response.json()
    assert data["status"] == "connected"
    assert "response_time" in data