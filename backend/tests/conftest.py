"""
N8N-Sensei Test Configuration
Test fixtures and setup for the N8N-Sensei backend
"""

import pytest
import asyncio
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from main import app
from database import get_db, Base
from config import Settings

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client():
    """Create a test client for the FastAPI app."""
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture
def test_settings():
    """Test configuration settings."""
    return Settings(
        database_url="sqlite:///./test.db",
        redis_url="redis://localhost:6379/1",
        n8n_url="http://localhost:5678",
        environment="test"
    )

@pytest.fixture
def sample_workflow():
    """Sample N8N workflow for testing."""
    return {
        "name": "Test Workflow",
        "nodes": [
            {
                "id": "start",
                "type": "n8n-nodes-base.start",
                "position": [100, 100],
                "parameters": {}
            },
            {
                "id": "webhook",
                "type": "n8n-nodes-base.webhook",
                "position": [300, 100],
                "parameters": {
                    "path": "test-webhook"
                }
            }
        ],
        "connections": {
            "start": {
                "main": [
                    [{"node": "webhook", "type": "main", "index": 0}]
                ]
            }
        }
    }

@pytest.fixture
def sample_ai_request():
    """Sample AI request for testing."""
    return {
        "message": "Create a workflow that sends an email when a webhook is triggered",
        "provider": "ollama",
        "model": "llama2",
        "context": {
            "workflow_type": "automation",
            "complexity": "simple"
        }
    }