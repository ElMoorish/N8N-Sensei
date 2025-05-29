"""
Configuration settings for the AI-N8N Bridge
"""

from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # N8N Configuration
    N8N_HOST: str = "localhost"
    N8N_PORT: int = 5678
    N8N_PROTOCOL: str = "http"
    N8N_API_KEY: Optional[str] = None
    
    # AI Providers - Local AI
    LLAMA_HOST: str = "localhost"
    LLAMA_PORT: int = 11434
    LLAMA_MODEL: str = "llama2"
    
    LM_STUDIO_HOST: str = "localhost"
    LM_STUDIO_PORT: int = 1234
    LM_STUDIO_MODEL: str = "local-model"
    
    OLLAMA_HOST: str = "localhost"
    OLLAMA_PORT: int = 11434
    OLLAMA_MODEL: str = "llama3.2:1b"
    
    # AI Providers - Cloud
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4"
    
    ANTHROPIC_API_KEY: Optional[str] = None
    ANTHROPIC_MODEL: str = "claude-3-sonnet-20240229"
    
    OPENROUTER_API_KEY: Optional[str] = None
    OPENROUTER_MODEL: str = "anthropic/claude-3-haiku"
    
    # Bridge Configuration
    BRIDGE_HOST: str = "0.0.0.0"
    BRIDGE_PORT: int = 8000
    FRONTEND_PORT: int = 3000
    
    # Database
    DATABASE_URL: str = "sqlite:///./bridge.db"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-this"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5678"
    
    # Features
    ENABLE_CHAT_EXTENSION: bool = True
    ENABLE_SAAS_MODE: bool = False
    ENABLE_MULTI_TENANT: bool = False
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    @property
    def n8n_base_url(self) -> str:
        return f"{self.N8N_PROTOCOL}://{self.N8N_HOST}:{self.N8N_PORT}"
    
    @property
    def llama_base_url(self) -> str:
        return f"http://{self.LLAMA_HOST}:{self.LLAMA_PORT}"
    
    @property
    def lm_studio_base_url(self) -> str:
        return f"http://{self.LM_STUDIO_HOST}:{self.LM_STUDIO_PORT}"
    
    @property
    def ollama_base_url(self) -> str:
        return f"http://{self.OLLAMA_HOST}:{self.OLLAMA_PORT}"
    
    @property
    def secret_key(self) -> str:
        return self.SECRET_KEY
    
    class Config:
        env_file = ".env"

settings = Settings()