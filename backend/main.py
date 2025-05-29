"""
N8N-Sensei - Your AI Workflow Sensei
Main FastAPI Application
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from routers import workflows, ai, health
from database import init_db
from config import settings

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown
    pass

app = FastAPI(
    title="N8N-Sensei API",
    description="Your AI Workflow Sensei - Bridge API for connecting AI models with N8N workflows",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(workflows.router, prefix="/api/workflows", tags=["workflows"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])

# Serve static files (frontend)
if os.path.exists("../frontend/dist"):
    app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="static")

@app.get("/")
async def root():
    return {
        "message": "N8N-Sensei API - Your AI Workflow Sensei 🥋",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health",
        "motto": "Master your workflows with AI wisdom"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.BRIDGE_HOST,
        port=settings.BRIDGE_PORT,
        reload=True
    )