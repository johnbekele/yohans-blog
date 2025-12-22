"""FastAPI application entry point"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager

from .config import settings
from .database import connect_to_mongo, close_mongo_connection
from .routes import auth, posts, portfolio, ai_blog, token_management


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()


# Create FastAPI application with optimized settings
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API for Blog Portfolio platform",
    lifespan=lifespan,
    # Disable docs in production for better security (can be enabled if needed)
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# Add compression middleware for faster responses
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Add CORS middleware
# Get allowed origins from settings
allowed_origins = list(settings.CORS_ORIGINS) if settings.CORS_ORIGINS else []

# Add default localhost origins (only in debug mode)
default_origins = []
if settings.DEBUG:
    default_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ]

# Add production URLs
production_origins = [
    "https://yohans-blog.vercel.app",
    "https://wise-trade-client.vercel.app",
]

# Combine all origins, avoiding duplicates
all_origins = set(allowed_origins + default_origins + production_origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(all_origins),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(posts.router, prefix="/api/posts", tags=["Blog Posts"])
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["Portfolio"])
app.include_router(ai_blog.router, prefix="/api/ai", tags=["AI Blog Generation"])
app.include_router(token_management.router, prefix="/api/token", tags=["Token Management"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Blog Portfolio API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "status": "active"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": settings.APP_VERSION}

