"""
Health check endpoints for N8N-Sensei
"""

from fastapi import APIRouter, HTTPException
from models import HealthResponse
from services.n8n_service import N8NService
from services.ai_service import AIService
from config import settings
import asyncio

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Comprehensive health check for all N8N-Sensei components
    """
    try:
        # Check N8N connection
        n8n_service = N8NService()
        n8n_connected = await n8n_service.check_connection()
        
        # Check AI providers
        ai_service = AIService()
        ai_providers = await ai_service.check_all_providers()
        
        # Check database (simple check)
        database_connected = True  # Will be enhanced with actual DB check
        
        return HealthResponse(
            status="healthy" if all([n8n_connected, database_connected]) else "degraded",
            version="1.0.0",
            n8n_connected=n8n_connected,
            ai_providers=ai_providers,
            database_connected=database_connected
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")

@router.get("/health/n8n")
async def n8n_health():
    """Check N8N specific health"""
    try:
        n8n_service = N8NService()
        connected = await n8n_service.check_connection()
        workflows_count = await n8n_service.get_workflows_count()
        
        return {
            "connected": connected,
            "base_url": settings.n8n_base_url,
            "workflows_count": workflows_count,
            "api_key_configured": bool(settings.N8N_API_KEY)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"N8N health check failed: {str(e)}")

@router.get("/health/ai")
async def ai_health():
    """Check AI providers health"""
    try:
        ai_service = AIService()
        providers = await ai_service.check_all_providers()
        
        return {
            "providers": providers,
            "default_provider": "llama",
            "total_available": sum(1 for available in providers.values() if available)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI health check failed: {str(e)}")