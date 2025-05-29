#!/bin/bash

# N8N-Sensei Startup Script
# Your AI Workflow Sensei 🥋

echo "🥋 Starting N8N-Sensei - Your AI Workflow Sensei"
echo "=================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please configure your settings in .env"
fi

# Start the services
echo "🚀 Starting N8N-Sensei services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check service status
echo "📊 Service Status:"
echo "=================="

# Check N8N-Sensei API
if curl -s http://localhost:8000/api/health > /dev/null; then
    echo "✅ N8N-Sensei API: Running (http://localhost:8000)"
else
    echo "❌ N8N-Sensei API: Not responding"
fi

# Check Frontend
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Sensei Dashboard: Running (http://localhost:3000)"
else
    echo "❌ Sensei Dashboard: Not responding"
fi

# Check N8N (if enabled)
if curl -s http://localhost:5678 > /dev/null; then
    echo "✅ N8N Instance: Running (http://localhost:5678)"
else
    echo "⚠️  N8N Instance: Not running (optional)"
fi

# Check Redis
if docker-compose ps redis | grep -q "Up"; then
    echo "✅ Redis Cache: Running"
else
    echo "❌ Redis Cache: Not running"
fi

echo ""
echo "🎯 Quick Access:"
echo "================"
echo "• Sensei Dashboard: http://localhost:3000"
echo "• API Documentation: http://localhost:8000/docs"
echo "• N8N Editor: http://localhost:5678 (if enabled)"
echo ""
echo "🤖 AI Providers Status:"
echo "======================="
echo "• LLama (Local): Configure in Settings"
echo "• LM Studio: Configure in Settings"
echo "• Ollama: Configure in Settings"
echo "• OpenAI: Add API key in Settings"
echo "• Anthropic: Add API key in Settings"
echo "• OpenRouter: Add API key in Settings"
echo ""
echo "📚 Next Steps:"
echo "=============="
echo "1. Open the Sensei Dashboard: http://localhost:3000"
echo "2. Configure your AI providers in Settings"
echo "3. Start creating workflows in the Workflow Dojo"
echo "4. Chat with your AI Sensei for guidance"
echo ""
echo "🥋 N8N-Sensei is ready! Master your workflows with AI wisdom."

# Optional: Open browser
if command -v xdg-open &> /dev/null; then
    echo "🌐 Opening Sensei Dashboard in browser..."
    xdg-open http://localhost:3000
elif command -v open &> /dev/null; then
    echo "🌐 Opening Sensei Dashboard in browser..."
    open http://localhost:3000
fi