# N8N-Sensei 🥋

Your AI Workflow Sensei - A powerful bridge system that connects AI models (Local LLama, OpenAI, Anthropic, OpenRouter) with N8N workflows for intelligent automation management.

## Features

- 🤖 **Multi-AI Provider Support**: Local LLama, OpenAI, Anthropic, OpenRouter
- 🔄 **Workflow Management**: Create, modify, and execute N8N workflows via AI
- 📊 **Intelligent Data Processing**: AI fills in workflow parameters automatically
- 🌐 **Web Interface**: User-friendly dashboard for managing AI-workflow connections
- 🔌 **RESTful API**: Complete API for programmatic access
- 🐳 **Docker Support**: Easy deployment with Docker Compose
- 💼 **SaaS Ready**: Built for scalability and multi-tenancy

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Providers  │    │  N8N-Sensei API │    │   N8N Instance  │
│                 │    │                 │    │                 │
│ • Local LLama   │◄──►│ • Workflow Mgmt │◄──►│ • Workflows     │
│ • OpenAI        │    │ • AI Integration│    │ • Executions    │
│ • Anthropic     │    │ • Smart Analysis│    │ • Webhooks      │
│ • OpenRouter    │    │ • Auto-filling  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              ▲
                              │
                    ┌─────────────────┐
                    │ Sensei Dashboard│
                    │                 │
                    │ • Workflow Dojo │
                    │ • AI Chat       │
                    │ • Training Hub  │
                    └─────────────────┘
```

## Quick Start

### Prerequisites

- Docker Desktop
- N8N running locally
- Local AI (LLama) or API keys for cloud providers

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-n8n-bridge
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your configurations
```

3. Start the services:
```bash
docker-compose up -d
```

4. Access the dashboard:
- Web Interface: http://localhost:3000
- API Documentation: http://localhost:8000/docs

## Configuration

### Environment Variables

```env
# N8N Configuration
N8N_HOST=localhost
N8N_PORT=5678
N8N_PROTOCOL=http
N8N_API_KEY=your_n8n_api_key

# AI Providers
LLAMA_HOST=localhost
LLAMA_PORT=11434
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
OPENROUTER_API_KEY=your_openrouter_key

# Bridge Configuration
BRIDGE_PORT=8000
FRONTEND_PORT=3000
DATABASE_URL=sqlite:///./bridge.db
```

## API Endpoints

### Workflows
- `GET /api/workflows` - List all workflows
- `POST /api/workflows` - Create new workflow
- `PUT /api/workflows/{id}` - Update workflow
- `DELETE /api/workflows/{id}` - Delete workflow
- `POST /api/workflows/{id}/execute` - Execute workflow

### AI Integration
- `POST /api/ai/chat` - Chat with AI about workflows
- `POST /api/ai/generate-workflow` - Generate workflow from description
- `POST /api/ai/optimize-workflow` - Optimize existing workflow
- `POST /api/ai/fill-parameters` - Auto-fill workflow parameters

## Use Cases

1. **Automated Data Processing**: AI analyzes data and creates appropriate N8N workflows
2. **Dynamic Workflow Generation**: Describe what you want, AI creates the workflow
3. **Intelligent Parameter Filling**: AI understands context and fills workflow parameters
4. **Workflow Optimization**: AI suggests improvements to existing workflows
5. **Natural Language Workflow Control**: Chat with AI to manage your automations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details