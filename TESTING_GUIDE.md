# N8N-Sensei Testing Guide 🧪

## Overview

N8N-Sensei includes a comprehensive testing framework to ensure reliability and quality of the AI-powered workflow automation system.

## Test Structure

```
backend/tests/
├── conftest.py              # Test configuration and fixtures
├── test_health.py           # Health check and system status tests
├── test_auth.py             # Authentication and authorization tests
├── test_integration.py      # Integration tests with AI providers
└── test_*.py               # Additional test modules
```

## Test Categories

### 1. Health Check Tests (`test_health.py`)
- **API Health**: Basic health endpoint functionality
- **Response Structure**: Validates health check response format
- **Performance**: Response time validation
- **Concurrent Requests**: Load testing capabilities

### 2. Authentication Tests (`test_auth.py`)
- **Password Hashing**: Secure password handling
- **JWT Tokens**: Token creation and validation
- **User Registration**: Account creation workflow
- **User Login**: Authentication flow
- **Protected Endpoints**: Authorization validation
- **Role-Based Access**: Permission system testing

### 3. Integration Tests (`test_integration.py`)
- **Ollama Integration**: Local AI provider testing
- **AI Provider Mocking**: Cloud provider simulation
- **End-to-End Workflows**: Complete user journeys
- **Error Handling**: Edge case validation
- **Performance Testing**: Load and stress testing

## Running Tests

### Prerequisites

1. **Backend Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Ollama Setup** (for integration tests):
   ```bash
   # Ollama should be running on localhost:11434
   # with llama3.2:1b model available
   ```

### Test Execution

#### Run All Tests
```bash
cd backend
python -m pytest tests/ -v
```

#### Run Specific Test Categories
```bash
# Health tests only
python -m pytest tests/test_health.py -v

# Authentication tests only
python -m pytest tests/test_auth.py -v

# Integration tests only
python -m pytest tests/test_integration.py -v
```

#### Run Specific Test Classes
```bash
# Ollama integration tests
python -m pytest tests/test_integration.py::TestOllamaIntegration -v

# Password hashing tests
python -m pytest tests/test_auth.py::TestPasswordHashing -v
```

#### Run with Output
```bash
# Show print statements and detailed output
python -m pytest tests/ -v -s
```

## Test Results Summary

### ✅ Passing Tests

1. **Health Check Tests** (4/4 passing)
   - Basic health endpoint ✅
   - Response structure validation ✅
   - Performance testing ✅
   - Concurrent request handling ✅

2. **Ollama Integration** (1/1 passing)
   - Local AI connection ✅
   - Message processing ✅
   - Response validation ✅

3. **Password Security** (1/1 passing)
   - Secure hashing ✅
   - Password verification ✅

### ⚠️ Known Issues

1. **Database Setup**: Some authentication tests require proper database initialization
2. **Test Isolation**: Database state management between tests
3. **Mock Dependencies**: Some cloud provider tests need better mocking

## Test Configuration

### Environment Variables
```bash
# Test database (automatically created)
DATABASE_URL=sqlite:///./test.db

# Ollama for integration tests
OLLAMA_HOST=localhost
OLLAMA_PORT=11434
OLLAMA_MODEL=llama3.2:1b
```

### Test Fixtures

- **`db_session`**: Clean database session for each test
- **`client`**: FastAPI test client with dependency overrides
- **`test_settings`**: Test-specific configuration
- **`sample_workflow`**: Mock N8N workflow data
- **`sample_ai_request`**: Mock AI request data

## Writing New Tests

### Test Structure Template
```python
import pytest
from fastapi.testclient import TestClient

class TestNewFeature:
    """Test new feature functionality"""
    
    def test_basic_functionality(self):
        """Test basic feature operation"""
        # Arrange
        test_data = {"key": "value"}
        
        # Act
        response = client.post("/api/endpoint", json=test_data)
        
        # Assert
        assert response.status_code == 200
        assert "expected_field" in response.json()
    
    @pytest.mark.asyncio
    async def test_async_functionality(self):
        """Test async feature operation"""
        # For async operations
        result = await some_async_function()
        assert result is not None
```

### Best Practices

1. **Test Isolation**: Each test should be independent
2. **Clear Naming**: Test names should describe what they test
3. **Arrange-Act-Assert**: Structure tests clearly
4. **Mock External Dependencies**: Don't rely on external services
5. **Test Edge Cases**: Include error conditions and boundary cases

## Continuous Integration

### GitHub Actions (Future)
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.12
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd backend
          python -m pytest tests/ -v --cov=.
```

## Coverage Goals

- **Unit Tests**: 80%+ code coverage
- **Integration Tests**: All major user flows
- **End-to-End Tests**: Complete feature workflows
- **Performance Tests**: Response time and load validation

## Debugging Tests

### Common Issues

1. **Import Errors**: Ensure PYTHONPATH includes backend directory
2. **Database Errors**: Check test database setup in conftest.py
3. **Async Errors**: Use `@pytest.mark.asyncio` for async tests
4. **Mock Failures**: Verify mock setup and return values

### Debug Commands
```bash
# Run with debugging
python -m pytest tests/ -v -s --pdb

# Run specific test with full output
python -m pytest tests/test_file.py::TestClass::test_method -v -s

# Show test coverage
python -m pytest tests/ --cov=. --cov-report=html
```

## Future Enhancements

1. **Performance Benchmarks**: Automated performance regression testing
2. **Load Testing**: Stress testing with multiple concurrent users
3. **Security Testing**: Automated security vulnerability scanning
4. **Integration Testing**: Full N8N workflow execution testing
5. **UI Testing**: Frontend component and integration testing

---

## Quick Start Testing

```bash
# 1. Start the backend
cd backend
python main.py

# 2. In another terminal, run tests
cd backend
python -m pytest tests/test_health.py -v

# 3. Test Ollama integration (requires Ollama running)
python -m pytest tests/test_integration.py::TestOllamaIntegration -v

# 4. Run all working tests
python -m pytest tests/test_health.py tests/test_integration.py::TestOllamaIntegration -v
```

This testing framework ensures N8N-Sensei maintains high quality and reliability as it evolves into a comprehensive AI-powered workflow automation platform! 🚀