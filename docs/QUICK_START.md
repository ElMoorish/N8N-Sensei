# 🥋 N8N-Sensei Quick Start Guide

Welcome to **N8N-Sensei** - Your AI Workflow Sensei! This guide will help you get started with intelligent workflow automation.

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Docker Compose available
- 8GB+ RAM recommended
- Ports 3000, 5678, 8000, 6379 available

### 1. Start N8N-Sensei
```bash
# Clone or navigate to the project directory
cd ai-n8n-bridge

# Start all services
./start-n8n-sensei.sh
```

### 2. Access the Dashboard
Open your browser and navigate to:
- **Sensei Dashboard**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **N8N Editor**: http://localhost:5678 (optional)

## 🎯 Core Features

### 1. **Sensei Dashboard** 🏠
Your command center for workflow automation:
- System health monitoring
- AI provider status
- Workflow performance metrics
- Quick actions and insights

### 2. **Workflow Dojo** 🥋
Master your workflows:
- Create workflows manually
- Generate workflows with AI
- Execute and monitor workflows
- AI-powered optimization

### 3. **AI Chat** 🤖
Your intelligent assistant:
- Natural language workflow creation
- Troubleshooting help
- Best practices guidance
- Multi-provider AI support

### 4. **Training Hub** 📚
Learn and improve:
- Interactive tutorials
- Best practices library
- AI integration guides
- Certification tracking

## 🤖 AI Providers Setup

### Local AI Providers (Recommended for Privacy)

#### 1. **LLama on Docker Desktop**
```bash
# Pull and run LLama
docker run -d -p 11434:11434 --name llama ollama/ollama
docker exec -it llama ollama pull llama2
```

#### 2. **LM Studio**
1. Download from https://lmstudio.ai/
2. Install and start the local server
3. Configure in N8N-Sensei Settings

#### 3. **Ollama**
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh
ollama serve
ollama pull llama2
```

### Cloud AI Providers

#### 1. **OpenAI**
1. Get API key from https://platform.openai.com/
2. Add to Settings → AI Providers → OpenAI

#### 2. **Anthropic (Claude)**
1. Get API key from https://console.anthropic.com/
2. Add to Settings → AI Providers → Anthropic

#### 3. **OpenRouter**
1. Get API key from https://openrouter.ai/
2. Add to Settings → AI Providers → OpenRouter

## 🎮 Usage Examples

### Example 1: Create a Simple Workflow
1. Go to **Workflow Dojo**
2. Click **"Generate with AI"**
3. Describe: "Send me a daily email with weather forecast"
4. Let AI generate the workflow
5. Execute and enjoy!

### Example 2: Chat with AI Sensei
1. Go to **AI Chat**
2. Ask: "How do I create a workflow that monitors my website uptime?"
3. Get step-by-step guidance
4. Implement the solution

### Example 3: Optimize Existing Workflow
1. Import your N8N workflow
2. Use AI Chat to ask: "How can I optimize this workflow?"
3. Get AI-powered recommendations
4. Apply improvements

## 🔧 Configuration

### Environment Variables (.env)
```bash
# N8N Configuration
N8N_HOST=localhost
N8N_PORT=5678
N8N_API_KEY=your_api_key_here

# AI Providers
LLAMA_HOST=localhost
LLAMA_PORT=11434
LM_STUDIO_HOST=localhost
LM_STUDIO_PORT=1234
OLLAMA_HOST=localhost
OLLAMA_PORT=11434
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
OPENROUTER_API_KEY=your_openrouter_key

# Bridge API
BRIDGE_HOST=0.0.0.0
BRIDGE_PORT=8000
DATABASE_URL=sqlite:///./n8n_sensei.db
REDIS_URL=redis://localhost:6379
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. **Services Not Starting**
```bash
# Check Docker status
docker ps

# View logs
docker-compose logs

# Restart services
docker-compose restart
```

#### 2. **AI Provider Connection Issues**
- Check if local AI services are running
- Verify API keys for cloud providers
- Test connections in Settings

#### 3. **Port Conflicts**
- Ensure ports 3000, 5678, 8000, 6379 are available
- Modify docker-compose.yml if needed

#### 4. **Performance Issues**
- Ensure 8GB+ RAM available
- Close unnecessary applications
- Use local AI providers for better performance

## 📊 Monitoring & Logs

### View Service Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f n8n-sensei-api
docker-compose logs -f n8n-sensei-frontend
```

### Health Checks
- API Health: http://localhost:8000/api/health
- Dashboard: http://localhost:3000
- N8N: http://localhost:5678

## 🎯 Best Practices

### 1. **Workflow Design**
- Use descriptive names
- Add error handling
- Document complex logic
- Test thoroughly

### 2. **AI Usage**
- Be specific in prompts
- Review AI-generated workflows
- Combine multiple AI providers
- Learn from AI suggestions

### 3. **Security**
- Use local AI for sensitive data
- Secure API keys
- Regular backups
- Monitor access logs

## 🚀 Advanced Features

### 1. **Multi-AI Workflow Generation**
- Compare outputs from different AI providers
- Combine strengths of various models
- Fallback mechanisms

### 2. **Intelligent Parameter Filling**
- AI suggests optimal values
- Context-aware recommendations
- Historical data analysis

### 3. **Performance Optimization**
- AI-powered bottleneck detection
- Resource usage optimization
- Execution time improvements

## 📈 Scaling for Production

### 1. **SaaS Deployment**
- Use cloud infrastructure
- Implement authentication
- Add multi-tenancy
- Monitor usage metrics

### 2. **Enterprise Features**
- Team collaboration
- Advanced security
- Custom AI models
- Enterprise integrations

## 🤝 Support & Community

### Getting Help
- Check documentation in `/docs`
- Review examples in `/examples`
- Open issues on GitHub
- Join community discussions

### Contributing
- Fork the repository
- Create feature branches
- Submit pull requests
- Follow coding standards

---

**🥋 Master your workflows with N8N-Sensei - Your AI Workflow Sensei!**

*Happy automating! 🚀*