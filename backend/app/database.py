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
    """Connect to MongoDB database"""
    print("🔌 Connecting to MongoDB...")
    db_manager.client = AsyncIOMotorClient(settings.MONGODB_URI)
    db_manager.db = db_manager.client[settings.DATABASE_NAME]
    print("✅ Connected to MongoDB successfully")


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

