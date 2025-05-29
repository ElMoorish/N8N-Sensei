"""
Test suite for N8N-Sensei authentication system
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from main import app
from database import User
from auth import (
    get_password_hash, verify_password, create_access_token,
    authenticate_user, create_user, UserCreate
)

client = TestClient(app)

class TestPasswordHashing:
    """Test password hashing functionality"""
    
    def test_password_hashing(self):
        """Test password hashing and verification"""
        password = "test_password_123"
        hashed = get_password_hash(password)
        
        assert hashed != password
        assert verify_password(password, hashed) is True
        assert verify_password("wrong_password", hashed) is False

class TestJWTTokens:
    """Test JWT token creation and verification"""
    
    def test_create_access_token(self):
        """Test JWT token creation"""
        data = {"sub": "user123", "role": "user"}
        token = create_access_token(data)
        
        assert isinstance(token, str)
        assert len(token) > 0

    def test_create_access_token_with_expiry(self):
        """Test JWT token creation with custom expiry"""
        data = {"sub": "user123", "role": "user"}
        expires_delta = timedelta(minutes=15)
        token = create_access_token(data, expires_delta)
        
        assert isinstance(token, str)
        assert len(token) > 0

class TestUserAuthentication:
    """Test user authentication functionality"""
    
    def test_authenticate_user_success(self, db_session: Session):
        """Test successful user authentication"""
        # Create test user
        user_data = UserCreate(
            email="test@example.com",
            password="test_password",
            full_name="Test User"
        )
        user = create_user(db_session, user_data)
        
        # Test authentication
        authenticated_user = authenticate_user(db_session, "test@example.com", "test_password")
        assert authenticated_user is not None
        assert authenticated_user.email == "test@example.com"
    
    def test_authenticate_user_wrong_password(self, db_session: Session):
        """Test authentication with wrong password"""
        # Create test user
        user_data = UserCreate(
            email="test2@example.com",
            password="test_password",
            full_name="Test User 2"
        )
        create_user(db_session, user_data)
        
        # Test authentication with wrong password
        authenticated_user = authenticate_user(db_session, "test2@example.com", "wrong_password")
        assert authenticated_user is None
    
    def test_authenticate_user_nonexistent(self, db_session: Session):
        """Test authentication with non-existent user"""
        authenticated_user = authenticate_user(db_session, "nonexistent@example.com", "password")
        assert authenticated_user is None

class TestUserRegistration:
    """Test user registration endpoints"""
    
    def test_register_user_success(self):
        """Test successful user registration"""
        user_data = {
            "email": f"newuser_{datetime.now().timestamp()}@example.com",
            "password": "secure_password_123",
            "full_name": "New User",
            "role": "user"
        }
        
        response = client.post("/api/auth/register", json=user_data)
        if response.status_code != 201:
            print(f"Registration failed: {response.status_code} - {response.text}")
        assert response.status_code == 201
        
        data = response.json()
        assert data["email"] == user_data["email"]
        assert data["full_name"] == user_data["full_name"]
        assert data["role"] == user_data["role"]
        assert "id" in data
    
    def test_register_user_duplicate_email(self):
        """Test registration with duplicate email"""
        user_data = {
            "email": "duplicate@example.com",
            "password": "password123",
            "full_name": "First User",
            "role": "user"
        }
        
        # First registration should succeed
        response1 = client.post("/api/auth/register", json=user_data)
        assert response1.status_code == 201
        
        # Second registration with same email should fail
        response2 = client.post("/api/auth/register", json=user_data)
        assert response2.status_code == 400
        assert "already registered" in response2.json()["detail"]

class TestUserLogin:
    """Test user login endpoints"""
    
    def test_login_success(self):
        """Test successful login"""
        # First register a user
        user_data = {
            "email": f"loginuser_{datetime.now().timestamp()}@example.com",
            "password": "login_password_123",
            "full_name": "Login User",
            "role": "user"
        }
        
        register_response = client.post("/api/auth/register", json=user_data)
        assert register_response.status_code == 201
        
        # Then login
        login_data = {
            "email": user_data["email"],
            "password": user_data["password"]
        }
        
        response = client.post("/api/auth/login-json", json=login_data)
        assert response.status_code == 200
        
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert "expires_in" in data
        assert "user_id" in data
        assert data["role"] == "user"
    
    def test_login_wrong_credentials(self):
        """Test login with wrong credentials"""
        login_data = {
            "email": "nonexistent@example.com",
            "password": "wrong_password"
        }
        
        response = client.post("/api/auth/login-json", json=login_data)
        assert response.status_code == 401
        assert "Incorrect email or password" in response.json()["detail"]

class TestProtectedEndpoints:
    """Test protected endpoints with authentication"""
    
    def get_auth_headers(self):
        """Helper to get authentication headers"""
        # Register and login a user
        user_data = {
            "email": f"authuser_{datetime.now().timestamp()}@example.com",
            "password": "auth_password_123",
            "full_name": "Auth User",
            "role": "user"
        }
        
        client.post("/api/auth/register", json=user_data)
        
        login_response = client.post("/api/auth/login-json", json={
            "email": user_data["email"],
            "password": user_data["password"]
        })
        
        token = login_response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}
    
    def test_get_current_user(self):
        """Test getting current user info"""
        headers = self.get_auth_headers()
        
        response = client.get("/api/auth/me", headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "id" in data
        assert "email" in data
        assert "full_name" in data
        assert "role" in data
        assert "is_active" in data
    
    def test_get_current_user_unauthorized(self):
        """Test getting current user without authentication"""
        response = client.get("/api/auth/me")
        assert response.status_code == 403  # No authorization header
    
    def test_get_current_user_invalid_token(self):
        """Test getting current user with invalid token"""
        headers = {"Authorization": "Bearer invalid_token"}
        
        response = client.get("/api/auth/me", headers=headers)
        assert response.status_code == 401
    
    def test_update_current_user(self):
        """Test updating current user info"""
        headers = self.get_auth_headers()
        
        update_data = {"full_name": "Updated Name"}
        
        response = client.put("/api/auth/me", json=update_data, headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        assert data["full_name"] == "Updated Name"
    
    def test_get_subscription_info(self):
        """Test getting subscription information"""
        headers = self.get_auth_headers()
        
        response = client.get("/api/auth/subscription", headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "tier" in data
        assert "api_quota_used" in data
        assert "api_quota_limit" in data
    
    def test_refresh_token(self):
        """Test token refresh"""
        headers = self.get_auth_headers()
        
        response = client.post("/api/auth/refresh-token", headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

class TestRateLimiting:
    """Test rate limiting functionality"""
    
    def test_api_rate_limiting(self):
        """Test API rate limiting (basic test)"""
        headers = self.get_auth_headers()
        
        # Make multiple requests (this is a basic test, 
        # real rate limiting would need more sophisticated testing)
        for i in range(5):
            response = client.get("/api/auth/me", headers=headers)
            assert response.status_code == 200
    
    def get_auth_headers(self):
        """Helper to get authentication headers"""
        user_data = {
            "email": f"ratelimituser_{datetime.now().timestamp()}@example.com",
            "password": "rate_password_123",
            "full_name": "Rate Limit User",
            "role": "user"
        }
        
        client.post("/api/auth/register", json=user_data)
        
        login_response = client.post("/api/auth/login-json", json={
            "email": user_data["email"],
            "password": user_data["password"]
        })
        
        token = login_response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}

class TestRoleBasedAccess:
    """Test role-based access control"""
    
    def test_user_role_access(self):
        """Test user role access to endpoints"""
        # This would test role-based access if we had admin-only endpoints
        # For now, we'll test that users can access user endpoints
        headers = self.get_auth_headers("user")
        
        response = client.get("/api/auth/me", headers=headers)
        assert response.status_code == 200
    
    def get_auth_headers(self, role="user"):
        """Helper to get authentication headers for specific role"""
        user_data = {
            "email": f"roleuser_{role}_{datetime.now().timestamp()}@example.com",
            "password": "role_password_123",
            "full_name": f"Role User {role}",
            "role": role
        }
        
        client.post("/api/auth/register", json=user_data)
        
        login_response = client.post("/api/auth/login-json", json={
            "email": user_data["email"],
            "password": user_data["password"]
        })
        
        token = login_response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}

# Integration tests
class TestAuthIntegration:
    """Test authentication integration with other endpoints"""
    
    def test_ai_chat_with_auth(self):
        """Test AI chat endpoint with authentication"""
        headers = self.get_auth_headers()
        
        chat_data = {
            "message": "Hello, test message",
            "provider": "ollama",
            "model": "llama3.2:1b"
        }
        
        response = client.post("/api/ai/chat", json=chat_data, headers=headers)
        # Should not be 401/403 (authentication should work)
        assert response.status_code != 401
        assert response.status_code != 403
    
    def test_workflows_with_auth(self):
        """Test workflows endpoint with authentication"""
        headers = self.get_auth_headers()
        
        response = client.get("/api/workflows", headers=headers)
        # Should not be 401/403 (authentication should work)
        assert response.status_code != 401
        assert response.status_code != 403
    
    def get_auth_headers(self):
        """Helper to get authentication headers"""
        user_data = {
            "email": f"integrationuser_{datetime.now().timestamp()}@example.com",
            "password": "integration_password_123",
            "full_name": "Integration User",
            "role": "user"
        }
        
        client.post("/api/auth/register", json=user_data)
        
        login_response = client.post("/api/auth/login-json", json={
            "email": user_data["email"],
            "password": user_data["password"]
        })
        
        token = login_response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}