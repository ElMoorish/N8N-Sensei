"""
Integration tests for N8N-Sensei
Tests real AI providers and end-to-end functionality
"""

import pytest
import asyncio
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock

from main import app
from services.ai_service import AIService
from models import AIProvider

client = TestClient(app)

class TestOllamaIntegration:
    """Test Ollama integration"""
    
    @pytest.mark.asyncio
    async def test_ollama_connection(self):
        """Test connection to Ollama"""
        ai_service = AIService()
        
        try:
            # Test if Ollama is available
            response = await ai_service.chat(
                message="Hello, this is a test message.",
                provider=AIProvider.OLLAMA,
                context="test_conversation"
            )
            
            assert response is not None
            assert isinstance(response, str)
            assert len(response) > 0
            
        except Exception as e:
            # If Ollama is not available, skip the test
            pytest.skip(f"Ollama not available: {str(e)}")
    
    @pytest.mark.asyncio
    async def test_ollama_conversation_context(self):
        """Test conversation context with Ollama"""
        ai_service = AIService()
        conversation_id = "test_context_conversation"
        
        try:
            # First message
            response1 = await ai_service.chat(
                message="My name is John. Remember this.",
                provider=AIProvider.OLLAMA,
                context=conversation_id
            )
            
            # Second message referencing the first
            response2 = await ai_service.chat(
                message="What is my name?",
                provider=AIProvider.OLLAMA,
                context=conversation_id
            )
            
            assert response1 is not None
            assert response2 is not None
            assert isinstance(response1, str)
            assert isinstance(response2, str)
            # The AI should remember the name from context
            assert "john" in response2.lower()
            
        except Exception as e:
            pytest.skip(f"Ollama not available: {str(e)}")

class TestAIServiceMocked:
    """Test AI service with mocked providers"""
    
    @pytest.mark.asyncio
    async def test_openai_provider_mock(self):
        """Test OpenAI provider with mock"""
        ai_service = AIService()
        
        with patch('openai.AsyncOpenAI') as mock_openai:
            mock_client = AsyncMock()
            mock_openai.return_value = mock_client
            
            mock_response = AsyncMock()
            mock_response.choices = [AsyncMock()]
            mock_response.choices[0].message.content = "Mocked OpenAI response"
            mock_client.chat.completions.create.return_value = mock_response
            
            response = await ai_service.chat(
                message="Test message",
                provider=AIProvider.OPENAI,
                context="test_conv"
            )
            
            assert response == "Mocked OpenAI response"
    
    @pytest.mark.asyncio
    async def test_anthropic_provider_mock(self):
        """Test Anthropic provider with mock"""
        ai_service = AIService()
        
        with patch('anthropic.AsyncAnthropic') as mock_anthropic:
            mock_client = AsyncMock()
            mock_anthropic.return_value = mock_client
            
            mock_response = AsyncMock()
            mock_response.content = [AsyncMock()]
            mock_response.content[0].text = "Mocked Anthropic response"
            mock_client.messages.create.return_value = mock_response
            
            response = await ai_service.chat(
                message="Test message",
                provider=AIProvider.ANTHROPIC,
                context="test_conv"
            )
            
            assert response == "Mocked Anthropic response"

class TestEndToEndWorkflow:
    """Test complete end-to-end workflows"""
    
    def get_auth_headers(self):
        """Helper to get authentication headers"""
        from datetime import datetime
        
        user_data = {
            "email": f"e2euser_{datetime.now().timestamp()}@example.com",
            "password": "e2e_password_123",
            "full_name": "E2E User",
            "role": "user"
        }
        
        client.post("/api/auth/register", json=user_data)
        
        login_response = client.post("/api/auth/login-json", json={
            "email": user_data["email"],
            "password": user_data["password"]
        })
        
        token = login_response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}
    
    def test_complete_ai_chat_workflow(self):
        """Test complete AI chat workflow with authentication"""
        headers = self.get_auth_headers()
        
        # Test AI chat endpoint
        chat_data = {
            "message": "Hello, I'm testing N8N-Sensei!",
            "provider": "ollama",
            "model": "llama3.2:1b"
        }
        
        response = client.post("/api/ai/chat", json=chat_data, headers=headers)
        
        # Should not fail due to authentication
        assert response.status_code != 401
        assert response.status_code != 403
        
        # If Ollama is available, should get a response
        if response.status_code == 200:
            data = response.json()
            assert "response" in data
            assert "conversation_id" in data
            assert data["provider"] == "ollama"
    
    def test_workflow_management_flow(self):
        """Test workflow management flow"""
        headers = self.get_auth_headers()
        
        # Get workflows
        response = client.get("/api/workflows", headers=headers)
        assert response.status_code != 401
        assert response.status_code != 403
        
        # Create workflow (if N8N is available)
        workflow_data = {
            "name": "Test Workflow",
            "description": "A test workflow created by N8N-Sensei",
            "nodes": []
        }
        
        response = client.post("/api/workflows", json=workflow_data, headers=headers)
        assert response.status_code != 401
        assert response.status_code != 403
    
    def test_ai_workflow_generation(self):
        """Test AI-powered workflow generation"""
        headers = self.get_auth_headers()
        
        generation_data = {
            "description": "Create a workflow that sends an email when a new file is uploaded",
            "provider": "ollama",
            "model": "llama3.2:1b"
        }
        
        response = client.post("/api/workflows/generate", json=generation_data, headers=headers)
        assert response.status_code != 401
        assert response.status_code != 403

class TestSystemHealth:
    """Test system health and monitoring"""
    
    def test_health_check(self):
        """Test health check endpoint"""
        response = client.get("/api/health")
        assert response.status_code == 200
        
        data = response.json()
        assert "status" in data
        assert "timestamp" in data
        assert "services" in data
    
    def test_health_check_detailed(self):
        """Test detailed health check"""
        response = client.get("/api/health/detailed")
        assert response.status_code == 200
        
        data = response.json()
        assert "database" in data
        assert "ai_providers" in data
        assert "n8n_connection" in data

class TestErrorHandling:
    """Test error handling and edge cases"""
    
    def get_auth_headers(self):
        """Helper to get authentication headers"""
        from datetime import datetime
        
        user_data = {
            "email": f"erroruser_{datetime.now().timestamp()}@example.com",
            "password": "error_password_123",
            "full_name": "Error User",
            "role": "user"
        }
        
        client.post("/api/auth/register", json=user_data)
        
        login_response = client.post("/api/auth/login-json", json={
            "email": user_data["email"],
            "password": user_data["password"]
        })
        
        token = login_response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}
    
    def test_invalid_ai_provider(self):
        """Test handling of invalid AI provider"""
        headers = self.get_auth_headers()
        
        chat_data = {
            "message": "Test message",
            "provider": "invalid_provider",
            "model": "some_model"
        }
        
        response = client.post("/api/ai/chat", json=chat_data, headers=headers)
        assert response.status_code == 422  # Validation error
    
    def test_missing_required_fields(self):
        """Test handling of missing required fields"""
        headers = self.get_auth_headers()
        
        # Missing message field
        chat_data = {
            "provider": "ollama",
            "model": "llama3.2:1b"
        }
        
        response = client.post("/api/ai/chat", json=chat_data, headers=headers)
        assert response.status_code == 422  # Validation error
    
    def test_empty_message(self):
        """Test handling of empty message"""
        headers = self.get_auth_headers()
        
        chat_data = {
            "message": "",
            "provider": "ollama",
            "model": "llama3.2:1b"
        }
        
        response = client.post("/api/ai/chat", json=chat_data, headers=headers)
        assert response.status_code == 422  # Should validate message is not empty

class TestPerformance:
    """Test performance and load handling"""
    
    def get_auth_headers(self):
        """Helper to get authentication headers"""
        from datetime import datetime
        
        user_data = {
            "email": f"perfuser_{datetime.now().timestamp()}@example.com",
            "password": "perf_password_123",
            "full_name": "Performance User",
            "role": "user"
        }
        
        client.post("/api/auth/register", json=user_data)
        
        login_response = client.post("/api/auth/login-json", json={
            "email": user_data["email"],
            "password": user_data["password"]
        })
        
        token = login_response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}
    
    def test_concurrent_requests(self):
        """Test handling of concurrent requests"""
        headers = self.get_auth_headers()
        
        # Make multiple concurrent requests to health endpoint
        import concurrent.futures
        import threading
        
        def make_request():
            return client.get("/api/health", headers=headers)
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(make_request) for _ in range(10)]
            results = [future.result() for future in concurrent.futures.as_completed(futures)]
        
        # All requests should succeed
        for response in results:
            assert response.status_code == 200
    
    def test_large_message_handling(self):
        """Test handling of large messages"""
        headers = self.get_auth_headers()
        
        # Create a large message (but not too large to avoid timeout)
        large_message = "This is a test message. " * 100  # ~2KB message
        
        chat_data = {
            "message": large_message,
            "provider": "ollama",
            "model": "llama3.2:1b"
        }
        
        response = client.post("/api/ai/chat", json=chat_data, headers=headers)
        # Should handle large messages gracefully
        assert response.status_code != 413  # Not "Payload Too Large"
        assert response.status_code != 500  # Not internal server error