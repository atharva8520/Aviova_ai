import os

class Settings:
    PROJECT_NAME: str = "Aviova AI - API RCA Copilot"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # AI Models (Groq)
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    GROQ_FALLBACK_MODEL: str = os.getenv("GROQ_FALLBACK_MODEL", "llama-3.1-8b-instant")
    
    # Database: defaults to SQLite for local runs, overridden by DATABASE_URL in docker-compose
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./aviova_rca.db"
    )
    SQLITE_FALLBACK_URL: str = "sqlite:///./aviova_rca.db"
    
    # CORS
    CORS_ORIGINS: list[str] = ["*"]

settings = Settings()
