"""
AI Service for N8N-Sensei - Handles all AI provider integrations
"""

import httpx
import json
from typing import Dict, Any, Optional, List
from config import settings
from models import AIProvider, AIMessage
import openai
import anthropic
from datetime import datetime

class AIService:
    def __init__(self):
        self.openai_client = None
        self.anthropic_client = None
        
        # Initialize clients if API keys are available
        if settings.OPENAI_API_KEY:
            self.openai_client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        
        if settings.ANTHROPIC_API_KEY:
            self.anthropic_client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    
    async def check_all_providers(self) -> Dict[str, bool]:
        """Check availability of all AI providers"""
        providers = {}
        
        # Check local AI providers
        providers["llama"] = await self._check_local_ai(settings.llama_base_url, "llama")
        providers["lm_studio"] = await self._check_local_ai(settings.lm_studio_base_url, "lm_studio")
        providers["ollama"] = await self._check_local_ai(settings.ollama_base_url, "ollama")
        
        # Check cloud providers
        providers["openai"] = await self._check_openai()
        providers["anthropic"] = await self._check_anthropic()
        providers["openrouter"] = await self._check_openrouter()
        
        return providers
    
    async def _check_local_ai(self, base_url: str, provider_type: str) -> bool:
        """Check if local AI provider is available"""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                if provider_type == "lm_studio":
                    # LM Studio uses OpenAI-compatible API
                    response = await client.get(f"{base_url}/v1/models")
                elif provider_type in ["llama", "ollama"]:
                    # Ollama/LLama API
                    response = await client.get(f"{base_url}/api/tags")
                else:
                    response = await client.get(f"{base_url}/health")
                
                return response.status_code == 200
        except Exception:
            return False
    
    async def _check_openai(self) -> bool:
        """Check OpenAI API availability"""
        if not self.openai_client:
            return False
        try:
            models = await self.openai_client.models.list()
            return len(models.data) > 0
        except Exception:
            return False
    
    async def _check_anthropic(self) -> bool:
        """Check Anthropic API availability"""
        if not self.anthropic_client:
            return False
        try:
            # Simple test message
            response = await self.anthropic_client.messages.create(
                model=settings.ANTHROPIC_MODEL,
                max_tokens=10,
                messages=[{"role": "user", "content": "test"}]
            )
            return bool(response)
        except Exception:
            return False
    
    async def _check_openrouter(self) -> bool:
        """Check OpenRouter API availability"""
        if not settings.OPENROUTER_API_KEY:
            return False
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://openrouter.ai/api/v1/models",
                    headers={"Authorization": f"Bearer {settings.OPENROUTER_API_KEY}"}
                )
                return response.status_code == 200
        except Exception:
            return False
    
    async def chat(self, message: str, provider: AIProvider, context: Optional[str] = None) -> str:
        """Send chat message to specified AI provider"""
        
        # Prepare system prompt for N8N workflow context
        system_prompt = """You are N8N-Sensei, an AI assistant specialized in N8N workflow automation. 
        You help users create, modify, and optimize N8N workflows. You can:
        1. Generate new workflows from descriptions
        2. Modify existing workflows
        3. Fill in workflow parameters intelligently
        4. Optimize workflows for better performance
        5. Explain workflow concepts and best practices
        
        Always provide practical, actionable advice and be ready to generate actual N8N workflow JSON when requested."""
        
        if context:
            system_prompt += f"\n\nCurrent context: {context}"
        
        try:
            if provider == AIProvider.OPENAI:
                return await self._chat_openai(message, system_prompt)
            elif provider == AIProvider.ANTHROPIC:
                return await self._chat_anthropic(message, system_prompt)
            elif provider == AIProvider.OPENROUTER:
                return await self._chat_openrouter(message, system_prompt)
            elif provider in [AIProvider.LLAMA, AIProvider.OLLAMA]:
                return await self._chat_ollama(message, system_prompt, provider)
            elif provider == AIProvider.LM_STUDIO:
                return await self._chat_lm_studio(message, system_prompt)
            else:
                raise ValueError(f"Unsupported AI provider: {provider}")
        except Exception as e:
            return f"Error communicating with {provider}: {str(e)}"
    
    async def _chat_openai(self, message: str, system_prompt: str) -> str:
        """Chat with OpenAI"""
        if not self.openai_client:
            raise ValueError("OpenAI client not initialized")
        
        response = await self.openai_client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            max_tokens=1000,
            temperature=0.7
        )
        
        return response.choices[0].message.content
    
    async def _chat_anthropic(self, message: str, system_prompt: str) -> str:
        """Chat with Anthropic Claude"""
        if not self.anthropic_client:
            raise ValueError("Anthropic client not initialized")
        
        response = await self.anthropic_client.messages.create(
            model=settings.ANTHROPIC_MODEL,
            max_tokens=1000,
            system=system_prompt,
            messages=[{"role": "user", "content": message}]
        )
        
        return response.content[0].text
    
    async def _chat_openrouter(self, message: str, system_prompt: str) -> str:
        """Chat with OpenRouter"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": settings.OPENROUTER_MODEL,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": message}
                    ],
                    "max_tokens": 1000,
                    "temperature": 0.7
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                return data["choices"][0]["message"]["content"]
            else:
                raise Exception(f"OpenRouter API error: {response.status_code}")
    
    async def _chat_ollama(self, message: str, system_prompt: str, provider: AIProvider) -> str:
        """Chat with Ollama/LLama"""
        base_url = settings.llama_base_url if provider == AIProvider.LLAMA else settings.ollama_base_url
        model = settings.LLAMA_MODEL if provider == AIProvider.LLAMA else settings.OLLAMA_MODEL
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{base_url}/api/generate",
                json={
                    "model": model,
                    "prompt": f"System: {system_prompt}\n\nUser: {message}\n\nAssistant:",
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "top_p": 0.9
                    }
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                return data.get("response", "No response generated")
            else:
                raise Exception(f"Ollama API error: {response.status_code}")
    
    async def _chat_lm_studio(self, message: str, system_prompt: str) -> str:
        """Chat with LM Studio (OpenAI-compatible)"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{settings.lm_studio_base_url}/v1/chat/completions",
                json={
                    "model": settings.LM_STUDIO_MODEL,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": message}
                    ],
                    "max_tokens": 1000,
                    "temperature": 0.7
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                return data["choices"][0]["message"]["content"]
            else:
                raise Exception(f"LM Studio API error: {response.status_code}")
    
    async def generate_workflow(self, description: str, provider: AIProvider) -> Dict[str, Any]:
        """Generate N8N workflow from description"""
        prompt = f"""Generate a complete N8N workflow based on this description: {description}

Please return a valid N8N workflow JSON with the following structure:
{{
  "name": "Workflow Name",
  "nodes": [
    // Array of workflow nodes
  ],
  "connections": {{
    // Node connections
  }},
  "active": true,
  "settings": {{}}
}}

Make sure to include proper node types, parameters, and connections. Use realistic node IDs and ensure the workflow is functional."""

        response = await self.chat(prompt, provider)
        
        # Try to extract JSON from response
        try:
            # Look for JSON in the response
            start = response.find('{')
            end = response.rfind('}') + 1
            if start != -1 and end != 0:
                workflow_json = json.loads(response[start:end])
                return workflow_json
            else:
                # If no JSON found, create a basic workflow structure
                return {
                    "name": f"Generated Workflow: {description[:50]}",
                    "nodes": [],
                    "connections": {},
                    "active": True,
                    "settings": {},
                    "ai_explanation": response
                }
        except json.JSONDecodeError:
            return {
                "name": f"Generated Workflow: {description[:50]}",
                "nodes": [],
                "connections": {},
                "active": True,
                "settings": {},
                "ai_explanation": response
            }