"""AI blog generation routes"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional

from ..services.ai_service import ai_blog_generator
from ..utils.security import decode_token
from ..database import get_database
from datetime import datetime
import re

router = APIRouter()


class AIBlogRequest(BaseModel):
    """AI blog generation request"""
    idea: str


class AIBlogResponse(BaseModel):
    """AI blog generation response"""
    success: bool
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[list] = None
    category: Optional[str] = None
    error: Optional[str] = None


def create_slug(title: str) -> str:
    """Create URL-friendly slug from title"""
    slug = title.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug[:100]


@router.post("/generate", response_model=AIBlogResponse)
async def generate_blog_post(
    request: AIBlogRequest,
    token: str = Depends(lambda: None)  # We'll add proper auth later
):
    """
    Generate a blog post using AI based on user's idea
    
    - **idea**: The topic or concept for the blog post
    """
    try:
        # Generate blog post using AI
        result = await ai_blog_generator.generate_blog_post(request.idea)
        
        if not result.get("success"):
            raise HTTPException(status_code=500, detail=result.get("error", "Failed to generate blog post"))
        
        return AIBlogResponse(
            success=True,
            title=result.get("title"),
            excerpt=result.get("excerpt"),
            content=result.get("content"),
            tags=result.get("tags"),
            category=result.get("category")
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-and-post")
async def generate_and_post_blog(
    request: AIBlogRequest,
):
    """
    Generate a blog post using AI and automatically post it
    
    - **idea**: The topic or concept for the blog post
    """
    try:
        # Generate blog post
        result = await ai_blog_generator.generate_blog_post(request.idea)
        
        if not result.get("success"):
            raise HTTPException(status_code=500, detail=result.get("error", "Failed to generate blog post"))
        
        # Create the blog post in database
        db = get_database()  # No await here - get_database() is not async
        posts_collection = db["posts"]
        
        # Calculate read time (rough estimate: 200 words per minute)
        word_count = len(result.get("content", "").split())
        read_time = max(1, word_count // 200)
        
        # Handle tags - can be string or list
        tags_data = result.get("tags", [])
        if isinstance(tags_data, str):
            tags = [tag.strip() for tag in tags_data.split(",") if tag.strip()]
        elif isinstance(tags_data, list):
            tags = [str(tag).strip() for tag in tags_data if str(tag).strip()]
        else:
            tags = []
        
        # Handle images - can be string or list
        images_data = result.get("images", [])
        if isinstance(images_data, str):
            images = [img.strip() for img in images_data.split(",") if img.strip()]
        elif isinstance(images_data, list):
            images = [str(img).strip() for img in images_data if str(img).strip()]
        else:
            images = []
        
        post_data = {
            "title": result.get("title"),
            "slug": create_slug(result.get("title", "untitled")),
            "excerpt": result.get("excerpt"),
            "content": result.get("content"),
            "author": "Yohans Bekele",
            "author_id": None,
            "featured_image": result.get("featured_image", None),
            "images": images,
            "tags": tags,
            "category": result.get("category", "general"),
            "published": True,
            "views": 0,
            "read_time": read_time,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert the post
        inserted = await posts_collection.insert_one(post_data)
        
        return {
            "success": True,
            "message": "Blog post generated and published successfully!",
            "post_id": str(inserted.inserted_id),
            "slug": post_data["slug"],
            "title": post_data["title"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

