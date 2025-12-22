"""MongoDB database connection and utilities"""
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
from .config import settings


class Database:
    """MongoDB database manager"""
    
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None


db_manager = Database()


async def connect_to_mongo():
    """Connect to MongoDB database with optimized connection pooling"""
    print("🔌 Connecting to MongoDB...")
    
    # Optimized connection settings for production
    # These settings improve performance on Render and other cloud platforms
    db_manager.client = AsyncIOMotorClient(
        settings.MONGODB_URI,
        # Connection pool settings for better performance
        maxPoolSize=50,  # Maximum number of connections in the pool
        minPoolSize=10,  # Minimum number of connections to maintain
        maxIdleTimeMS=45000,  # Close connections after 45 seconds of inactivity
        serverSelectionTimeoutMS=5000,  # Timeout for server selection
        connectTimeoutMS=10000,  # Connection timeout
        socketTimeoutMS=20000,  # Socket timeout
        # Retry settings for better reliability
        retryWrites=True,
        retryReads=True,
        # Compression for faster data transfer
        compressors='snappy,zlib',
        # Heartbeat to keep connections alive
        heartbeatFrequencyMS=10000,
    )
    db_manager.db = db_manager.client[settings.DATABASE_NAME]
    
    # Create indexes for better query performance
    await create_indexes()
    
    print("✅ Connected to MongoDB successfully")


async def create_indexes():
    """Create database indexes for optimized queries"""
    db = db_manager.db
    
    # Posts collection indexes
    posts_collection = db["posts"]
    await posts_collection.create_index("slug", unique=True)
    await posts_collection.create_index("published")
    await posts_collection.create_index("created_at")
    await posts_collection.create_index("category")
    await posts_collection.create_index("tags")
    await posts_collection.create_index([("title", "text"), ("excerpt", "text")])  # Text search index
    await posts_collection.create_index([("published", 1), ("created_at", -1)])  # Compound index for common query
    
    # Users collection indexes
    users_collection = db["users"]
    await users_collection.create_index("email", unique=True)
    await users_collection.create_index("username", unique=True)
    
    # Portfolio collection indexes (if needed)
    portfolio_collection = db["portfolio"]
    # Portfolio typically has one document, but we can add indexes if needed
    
    print("✅ Database indexes created")


async def close_mongo_connection():
    """Close MongoDB connection"""
    print("🔌 Closing MongoDB connection...")
    if db_manager.client:
        db_manager.client.close()
    print("✅ MongoDB connection closed")


def get_database() -> AsyncIOMotorDatabase:
    """Get database instance"""
    return db_manager.db


# Collection names
USERS_COLLECTION = "users"
POSTS_COLLECTION = "posts"
PORTFOLIO_COLLECTION = "portfolio"

