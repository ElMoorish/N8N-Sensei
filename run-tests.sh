#!/bin/bash

# N8N-Sensei Test Runner
# Comprehensive testing script for the N8N-Sensei project

set -e

echo "🥋 N8N-Sensei Test Runner"
echo "========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Parse command line arguments
BACKEND_TESTS=true
FRONTEND_TESTS=true
INTEGRATION_TESTS=false
COVERAGE=false
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --backend-only)
            FRONTEND_TESTS=false
            shift
            ;;
        --frontend-only)
            BACKEND_TESTS=false
            shift
            ;;
        --integration)
            INTEGRATION_TESTS=true
            shift
            ;;
        --coverage)
            COVERAGE=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --backend-only    Run only backend tests"
            echo "  --frontend-only   Run only frontend tests"
            echo "  --integration     Run integration tests"
            echo "  --coverage        Generate coverage reports"
            echo "  --verbose         Verbose output"
            echo "  --help           Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Create test results directory
mkdir -p test-results

# Backend Tests
if [ "$BACKEND_TESTS" = true ]; then
    print_status "Running backend tests..."
    
    cd backend
    
    # Install dependencies if needed
    if [ ! -d "venv" ]; then
        print_status "Creating virtual environment..."
        python -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
    else
        source venv/bin/activate
    fi
    
    # Set test environment variables
    export DATABASE_URL="sqlite:///./test.db"
    export SECRET_KEY="test-secret-key"
    export ENVIRONMENT="test"
    
    # Run tests
    if [ "$COVERAGE" = true ]; then
        print_status "Running backend tests with coverage..."
        if [ "$VERBOSE" = true ]; then
            pytest tests/ -v --cov=. --cov-report=html --cov-report=xml --cov-report=term
        else
            pytest tests/ --cov=. --cov-report=html --cov-report=xml
        fi
        
        # Move coverage reports
        mv htmlcov ../test-results/backend-coverage-html
        mv coverage.xml ../test-results/backend-coverage.xml
        print_success "Backend coverage report generated in test-results/"
    else
        if [ "$VERBOSE" = true ]; then
            pytest tests/ -v
        else
            pytest tests/
        fi
    fi
    
    # Clean up test database
    rm -f test.db
    
    deactivate
    cd ..
    
    print_success "Backend tests completed"
fi

# Frontend Tests
if [ "$FRONTEND_TESTS" = true ]; then
    print_status "Running frontend tests..."
    
    cd frontend
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    # Run tests
    if [ "$COVERAGE" = true ]; then
        print_status "Running frontend tests with coverage..."
        npm test -- --coverage --watchAll=false --coverageDirectory=../test-results/frontend-coverage
    else
        npm test -- --watchAll=false
    fi
    
    # Run linting
    print_status "Running frontend linting..."
    npm run lint
    
    # Build check
    print_status "Testing frontend build..."
    npm run build
    
    cd ..
    
    print_success "Frontend tests completed"
fi

# Integration Tests
if [ "$INTEGRATION_TESTS" = true ]; then
    print_status "Running integration tests..."
    
    # Start services
    print_status "Starting test services..."
    docker-compose -f docker-compose.test.yml up -d
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Run integration tests
    cd backend
    source venv/bin/activate
    
    export DATABASE_URL="postgresql://test:test@localhost:5433/test"
    export N8N_URL="http://localhost:5679"
    
    pytest tests/integration/ -v
    
    deactivate
    cd ..
    
    # Stop services
    print_status "Stopping test services..."
    docker-compose -f docker-compose.test.yml down
    
    print_success "Integration tests completed"
fi

# Generate test summary
print_status "Generating test summary..."

echo ""
echo "🎯 Test Summary"
echo "==============="

if [ "$BACKEND_TESTS" = true ]; then
    echo "✅ Backend tests: PASSED"
fi

if [ "$FRONTEND_TESTS" = true ]; then
    echo "✅ Frontend tests: PASSED"
fi

if [ "$INTEGRATION_TESTS" = true ]; then
    echo "✅ Integration tests: PASSED"
fi

if [ "$COVERAGE" = true ]; then
    echo "📊 Coverage reports generated in test-results/"
fi

echo ""
print_success "All tests completed successfully! 🎉"

# Open coverage reports if available
if [ "$COVERAGE" = true ] && command -v open &> /dev/null; then
    print_status "Opening coverage reports..."
    open test-results/backend-coverage-html/index.html 2>/dev/null || true
    open test-results/frontend-coverage/lcov-report/index.html 2>/dev/null || true
fi