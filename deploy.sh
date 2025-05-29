#!/bin/bash

# N8N-Sensei Deployment Script
# Production deployment automation

set -e

echo "🚀 N8N-Sensei Deployment Script"
echo "==============================="

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

# Default values
ENVIRONMENT="production"
SKIP_TESTS=false
SKIP_BACKUP=false
FORCE_DEPLOY=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --skip-backup)
            SKIP_BACKUP=true
            shift
            ;;
        --force)
            FORCE_DEPLOY=true
            shift
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --env ENV         Deployment environment (production, staging)"
            echo "  --skip-tests      Skip running tests before deployment"
            echo "  --skip-backup     Skip database backup"
            echo "  --force          Force deployment without confirmation"
            echo "  --help           Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Validate environment
if [[ "$ENVIRONMENT" != "production" && "$ENVIRONMENT" != "staging" ]]; then
    print_error "Invalid environment: $ENVIRONMENT. Must be 'production' or 'staging'"
    exit 1
fi

print_status "Deploying to $ENVIRONMENT environment"

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check if environment file exists
ENV_FILE=".env.$ENVIRONMENT"
if [ ! -f "$ENV_FILE" ]; then
    print_error "Environment file $ENV_FILE not found"
    print_status "Please copy .env.$ENVIRONMENT.example to $ENV_FILE and configure it"
    exit 1
fi

# Load environment variables
source "$ENV_FILE"

# Pre-deployment checks
print_status "Running pre-deployment checks..."

# Check Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed"
    exit 1
fi

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    print_error "Docker daemon is not running"
    exit 1
fi

print_success "Pre-deployment checks passed"

# Run tests (unless skipped)
if [ "$SKIP_TESTS" = false ]; then
    print_status "Running tests before deployment..."
    ./run-tests.sh --backend-only
    print_success "Tests passed"
else
    print_warning "Skipping tests (--skip-tests flag used)"
fi

# Backup database (unless skipped)
if [ "$SKIP_BACKUP" = false ] && [ "$ENVIRONMENT" = "production" ]; then
    print_status "Creating database backup..."
    
    BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Backup PostgreSQL database
    if docker-compose ps | grep -q postgres; then
        docker-compose exec -T postgres pg_dump -U n8nsensei n8nsensei > "$BACKUP_DIR/database.sql"
        print_success "Database backup created: $BACKUP_DIR/database.sql"
    else
        print_warning "PostgreSQL container not running, skipping database backup"
    fi
else
    print_warning "Skipping database backup"
fi

# Confirmation prompt (unless forced)
if [ "$FORCE_DEPLOY" = false ]; then
    echo ""
    print_warning "You are about to deploy to $ENVIRONMENT environment"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Deployment cancelled"
        exit 0
    fi
fi

# Start deployment
print_status "Starting deployment..."

# Pull latest images
print_status "Pulling latest Docker images..."
docker-compose -f "docker-compose.$ENVIRONMENT.yml" pull

# Build custom images
print_status "Building N8N-Sensei images..."
docker-compose -f "docker-compose.$ENVIRONMENT.yml" build --no-cache

# Stop existing services
print_status "Stopping existing services..."
docker-compose -f "docker-compose.$ENVIRONMENT.yml" down

# Start services
print_status "Starting services..."
docker-compose -f "docker-compose.$ENVIRONMENT.yml" up -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 30

# Health checks
print_status "Running health checks..."

# Check API health
API_URL="http://localhost:8000"
if [ "$ENVIRONMENT" = "production" ]; then
    API_URL="https://api.yourdomain.com"
fi

for i in {1..10}; do
    if curl -f "$API_URL/api/health" &> /dev/null; then
        print_success "API health check passed"
        break
    else
        if [ $i -eq 10 ]; then
            print_error "API health check failed after 10 attempts"
            exit 1
        fi
        print_status "Waiting for API to be ready... (attempt $i/10)"
        sleep 10
    fi
done

# Check N8N health
N8N_URL="http://localhost:5678"
if [ "$ENVIRONMENT" = "production" ]; then
    N8N_URL="https://n8n.yourdomain.com"
fi

for i in {1..10}; do
    if curl -f "$N8N_URL/healthz" &> /dev/null; then
        print_success "N8N health check passed"
        break
    else
        if [ $i -eq 10 ]; then
            print_error "N8N health check failed after 10 attempts"
            exit 1
        fi
        print_status "Waiting for N8N to be ready... (attempt $i/10)"
        sleep 10
    fi
done

# Run database migrations
print_status "Running database migrations..."
docker-compose -f "docker-compose.$ENVIRONMENT.yml" exec -T n8n-sensei-api python -c "
from database import init_database
init_database()
print('Database migrations completed')
"

# Post-deployment tasks
print_status "Running post-deployment tasks..."

# Clean up old Docker images
print_status "Cleaning up old Docker images..."
docker image prune -f

# Show deployment status
print_status "Deployment status:"
docker-compose -f "docker-compose.$ENVIRONMENT.yml" ps

# Generate deployment report
REPORT_FILE="deployment-report-$(date +%Y%m%d_%H%M%S).txt"
cat > "$REPORT_FILE" << EOF
N8N-Sensei Deployment Report
===========================

Environment: $ENVIRONMENT
Deployment Time: $(date)
Git Commit: $(git rev-parse HEAD)
Git Branch: $(git branch --show-current)

Services Status:
$(docker-compose -f "docker-compose.$ENVIRONMENT.yml" ps)

Health Checks:
- API: ✅ PASSED
- N8N: ✅ PASSED

Backup Location: $BACKUP_DIR (if created)

Deployment completed successfully!
EOF

print_success "Deployment report saved: $REPORT_FILE"

echo ""
print_success "🎉 Deployment completed successfully!"
echo ""
print_status "Services are now running:"
if [ "$ENVIRONMENT" = "production" ]; then
    echo "  🌐 N8N-Sensei API: https://api.yourdomain.com"
    echo "  🔧 N8N Workflows: https://n8n.yourdomain.com"
    echo "  📊 Monitoring: https://monitoring.yourdomain.com"
    echo "  🔍 Traefik Dashboard: https://traefik.yourdomain.com"
else
    echo "  🌐 N8N-Sensei API: http://localhost:8000"
    echo "  🔧 N8N Workflows: http://localhost:5678"
    echo "  📊 Monitoring: http://localhost:3001"
fi

echo ""
print_status "Next steps:"
echo "  1. Verify all services are working correctly"
echo "  2. Run integration tests if needed"
echo "  3. Monitor logs for any issues"
echo "  4. Update DNS records if deploying to production"

# Show logs option
read -p "Would you like to view the logs? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose -f "docker-compose.$ENVIRONMENT.yml" logs -f
fi