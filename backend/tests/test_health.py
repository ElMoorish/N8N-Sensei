"""
N8N-Sensei Health Endpoint Tests
Tests for the health check functionality
"""

import pytest
from fastapi.testclient import TestClient

def test_health_check(client: TestClient):
    """Test the health check endpoint."""
    response = client.get("/api/health")
    assert response.status_code == 200
    
    data = response.json()
    assert "status" in data  # Can be "healthy", "degraded", or "unhealthy"
    assert "version" in data

def test_health_check_structure(client: TestClient):
    """Test the health check response structure."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    
    required_fields = ["status", "version"]
    for field in required_fields:
        assert field in data

def test_health_check_performance(client: TestClient):
    """Test health check response time."""
    import time
    
    start_time = time.time()
    response = client.get("/api/health")
    end_time = time.time()
    
    assert response.status_code == 200
    assert (end_time - start_time) < 1.0  # Should respond within 1 second

def test_health_check_multiple_requests(client: TestClient):
    """Test multiple health check requests."""
    for _ in range(5):
        response = client.get("/api/health")
        assert response.status_code == 200