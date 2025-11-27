"""AI blog generation routes"""
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional, Literal

from ..services.ai_service import ai_blog_generator, gemini_blog_generator, validate_token
from ..middleware.auth_middleware import get_current_admin_user
from ..schemas.auth import TokenData
from ..database import get_database, USERS_COLLECTION
from datetime import datetime
import re
from bson import ObjectId

router = APIRouter()


class AIBlogRequest(BaseModel):
    """AI blog generation request"""
    idea: str
    model: Literal["gpt", "gemini"] = "gpt"  # Default to GPT for backward compatibility


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


async def get_user_token(user_id: str) -> Optional[str]:
    """Get user's saved Open Arena token from database"""
    db = get_database()
    users_collection = db[USERS_COLLECTION]
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    return user.get("tr_gpt_token") if user else None


@router.post("/generate", response_model=AIBlogResponse)
async def generate_blog_post(
    request: AIBlogRequest,
    current_user: TokenData = Depends(get_current_admin_user)
):
    """
    Generate a blog post using AI based on user's idea
    
    - **idea**: The topic or concept for the blog post
    """
    try:
        # Get user's token
        token = await get_user_token(current_user.user_id)
        
        if not token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No Open Arena token found. Please add your ESSO token in the admin panel."
            )
        
        # Validate token before use
        validation = await validate_token(token)
        if not validation.get("valid"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Your token is expired or invalid. Please update it. Error: {validation.get('error')}"
            )
        
        # Generate blog post using AI
        result = await ai_blog_generator.generate_blog_post(request.idea, token)
        
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
    current_user: TokenData = Depends(get_current_admin_user)
):
    """
    Generate a blog post using AI and automatically post it
    
    - **idea**: The topic or concept for the blog post
    - **model**: AI model to use ("gpt" or "gemini")
    """
    try:
        import traceback
        import sys
        
        # If using Gemini
        if request.model == "gemini":
            if not gemini_blog_generator:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Gemini AI is not configured. Please set GOOGLE_AI_API environment variable."
                )
            
            # Generate blog post with Gemini (no token needed)
            try:
                print(f"🔵 DEBUG: Calling Gemini generator with idea: {request.idea[:100]}", file=sys.stderr)
                result = await gemini_blog_generator.generate_blog_post(request.idea)
                print(f"🟢 DEBUG: Gemini result keys: {list(result.keys())}", file=sys.stderr)
                print(f"🟢 DEBUG: Result success: {result.get('success')}", file=sys.stderr)
                if result.get('success'):
                    print(f"🟢 DEBUG: Title: {result.get('title', 'N/A')}", file=sys.stderr)
                    print(f"🟢 DEBUG: Content length: {len(result.get('content', ''))}", file=sys.stderr)
                    print(f"🟢 DEBUG: Content preview (first 200): {result.get('content', '')[:200]}", file=sys.stderr)
            except Exception as e:
                print(f"ERROR in Gemini generation: {str(e)}", file=sys.stderr)
                traceback.print_exc()
                raise HTTPException(status_code=500, detail=f"Gemini error: {str(e)}")
        else:
            # Using GPT - requires token
            token = await get_user_token(current_user.user_id)
            
            if not token:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No Open Arena token found. Please add your ESSO token in the admin panel or use Gemini model."
                )
            
            # Validate token before use
            validation = await validate_token(token)
            if not validation.get("valid"):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Your token is expired or invalid. Please update it or use Gemini model. Error: {validation.get('error')}"
                )
            
            # Generate blog post with GPT
            try:
                result = await ai_blog_generator.generate_blog_post(request.idea, token)
            except Exception as e:
                print(f"ERROR in GPT generation: {str(e)}", file=sys.stderr)
                traceback.print_exc()
                raise HTTPException(status_code=500, detail=f"GPT error: {str(e)}")
        
        if not result.get("success"):
            print(f"🔴 DEBUG: Generation failed: {result.get('error')}", file=sys.stderr)
            raise HTTPException(status_code=500, detail=result.get("error", "Failed to generate blog post"))
        
        # Create the blog post in database
        db = get_database()
        posts_collection = db["posts"]
        
        # Calculate read time (rough estimate: 200 words per minute)
        word_count = len(result.get("content", "").split())
        read_time = max(1, word_count // 200)
        
        print(f"📊 DEBUG: Word count: {word_count}, Read time: {read_time} min", file=sys.stderr)
        
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
        
        # Add model tag to identify which AI generated it
        model_used = result.get("model", request.model)
        tags.append(f"Generated by {model_used}")
        
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
        
        print(f"✅ DEBUG: Post created with ID: {inserted.inserted_id}", file=sys.stderr)
        print(f"✅ DEBUG: Post slug: {post_data['slug']}", file=sys.stderr)
        print(f"✅ DEBUG: Post content length in DB: {len(post_data['content'])}", file=sys.stderr)
        
        return_data = {
            "success": True,
            "message": f"Blog post generated with {model_used.upper()} and published successfully!",
            "post_id": str(inserted.inserted_id),
            "slug": post_data["slug"],
            "title": post_data["title"],
            "model": model_used
        }
        
        print(f"📤 DEBUG: Returning to frontend:", return_data, file=sys.stderr)
        
        return return_data
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        import sys
        print(f"ERROR in generate_and_post_blog: {str(e)}", file=sys.stderr)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

