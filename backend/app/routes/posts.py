"""Blog posts routes"""
from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
import math

from ..database import get_database, POSTS_COLLECTION
from ..schemas.post import PostCreate, PostUpdate, PostResponse, PostListItem, PostsListResponse
from ..middleware.auth_middleware import get_current_admin_user, get_optional_user
from ..schemas.auth import TokenData
from ..utils.slugify import slugify, calculate_read_time


router = APIRouter()


@router.get("", response_model=PostsListResponse)
async def get_posts(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    published_only: bool = Query(True),
    category: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    current_user: Optional[TokenData] = Depends(get_optional_user)
):
    """Get paginated list of blog posts"""
    db = get_database()
    posts_collection = db[POSTS_COLLECTION]
    
    # Build query
    query = {}
    
    # If not admin, show only published posts
    if not current_user or current_user.role != "admin":
        query["published"] = True
    elif not published_only:
        # Admin can choose to see all posts
        pass
    else:
        query["published"] = True
    
    # Filter by category
    if category:
        query["category"] = category
    
    # Filter by tag
    if tag:
        query["tags"] = tag
    
    # Search in title and excerpt
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"excerpt": {"$regex": search, "$options": "i"}}
        ]
    
    # Get total count
    total = await posts_collection.count_documents(query)
    
    # Calculate pagination
    skip = (page - 1) * page_size
    total_pages = math.ceil(total / page_size)
    
    # Get posts
    cursor = posts_collection.find(query).sort("created_at", -1).skip(skip).limit(page_size)
    posts = await cursor.to_list(length=page_size)
    
    # Format response
    post_items = [
        PostListItem(
            _id=str(post["_id"]),
            title=post["title"],
            slug=post["slug"],
            excerpt=post["excerpt"],
            author=post["author"],
            featured_image=post.get("featured_image"),
            tags=post["tags"],
            category=post["category"],
            published=post["published"],
            views=post["views"],
            read_time=post["read_time"],
            created_at=post["created_at"].isoformat()
        )
        for post in posts
    ]
    
    return PostsListResponse(
        posts=post_items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


@router.get("/{slug}", response_model=PostResponse)
async def get_post_by_slug(
    slug: str,
    current_user: Optional[TokenData] = Depends(get_optional_user)
):
    """Get single blog post by slug"""
    db = get_database()
    posts_collection = db[POSTS_COLLECTION]
    
    post = await posts_collection.find_one({"slug": slug})
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check if unpublished and user is not admin
    if not post["published"] and (not current_user or current_user.role != "admin"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Increment view count
    await posts_collection.update_one(
        {"_id": post["_id"]},
        {"$inc": {"views": 1}}
    )
    
    return PostResponse(
        _id=str(post["_id"]),
        title=post["title"],
        slug=post["slug"],
        excerpt=post["excerpt"],
        content=post["content"],
        author=post["author"],
        featured_image=post.get("featured_image"),
        tags=post["tags"],
        category=post["category"],
        published=post["published"],
        views=post["views"] + 1,
        read_time=post["read_time"],
        created_at=post["created_at"].isoformat(),
        updated_at=post["updated_at"].isoformat()
    )


@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_data: PostCreate,
    current_user: TokenData = Depends(get_current_admin_user)
):
    """Create new blog post (admin only)"""
    db = get_database()
    posts_collection = db[POSTS_COLLECTION]
    users_collection = db["users"]
    
    # Get author info
    user = await users_collection.find_one({"_id": ObjectId(current_user.user_id)})
    
    # Generate slug
    post_slug = slugify(post_data.title)
    
    # Check if slug exists
    existing_post = await posts_collection.find_one({"slug": post_slug})
    if existing_post:
        # Add timestamp to make unique
        post_slug = f"{post_slug}-{int(datetime.utcnow().timestamp())}"
    
    # Calculate read time
    read_time = calculate_read_time(post_data.content)
    
    # Create post document
    post_dict = {
        "title": post_data.title,
        "slug": post_slug,
        "excerpt": post_data.excerpt,
        "content": post_data.content,
        "author": user["username"],
        "author_id": ObjectId(current_user.user_id),
        "featured_image": post_data.featured_image,
        "tags": post_data.tags,
        "category": post_data.category,
        "published": post_data.published,
        "views": 0,
        "read_time": read_time,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await posts_collection.insert_one(post_dict)
    post_dict["_id"] = str(result.inserted_id)
    
    return PostResponse(
        _id=post_dict["_id"],
        title=post_dict["title"],
        slug=post_dict["slug"],
        excerpt=post_dict["excerpt"],
        content=post_dict["content"],
        author=post_dict["author"],
        featured_image=post_dict["featured_image"],
        tags=post_dict["tags"],
        category=post_dict["category"],
        published=post_dict["published"],
        views=post_dict["views"],
        read_time=post_dict["read_time"],
        created_at=post_dict["created_at"].isoformat(),
        updated_at=post_dict["updated_at"].isoformat()
    )


@router.put("/{slug}", response_model=PostResponse)
async def update_post(
    slug: str,
    post_data: PostUpdate,
    current_user: TokenData = Depends(get_current_admin_user)
):
    """Update blog post (admin only)"""
    db = get_database()
    posts_collection = db[POSTS_COLLECTION]
    
    # Find post
    post = await posts_collection.find_one({"slug": slug})
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Build update data
    update_data = {"updated_at": datetime.utcnow()}
    
    if post_data.title is not None:
        update_data["title"] = post_data.title
        # Update slug if title changed
        new_slug = slugify(post_data.title)
        if new_slug != slug:
            # Check if new slug exists
            existing = await posts_collection.find_one({"slug": new_slug})
            if existing and str(existing["_id"]) != str(post["_id"]):
                new_slug = f"{new_slug}-{int(datetime.utcnow().timestamp())}"
            update_data["slug"] = new_slug
    
    if post_data.excerpt is not None:
        update_data["excerpt"] = post_data.excerpt
    
    if post_data.content is not None:
        update_data["content"] = post_data.content
        update_data["read_time"] = calculate_read_time(post_data.content)
    
    if post_data.featured_image is not None:
        update_data["featured_image"] = post_data.featured_image
    
    if post_data.tags is not None:
        update_data["tags"] = post_data.tags
    
    if post_data.category is not None:
        update_data["category"] = post_data.category
    
    if post_data.published is not None:
        update_data["published"] = post_data.published
    
    # Update post
    await posts_collection.update_one(
        {"_id": post["_id"]},
        {"$set": update_data}
    )
    
    # Get updated post
    updated_post = await posts_collection.find_one({"_id": post["_id"]})
    
    return PostResponse(
        _id=str(updated_post["_id"]),
        title=updated_post["title"],
        slug=updated_post["slug"],
        excerpt=updated_post["excerpt"],
        content=updated_post["content"],
        author=updated_post["author"],
        featured_image=updated_post.get("featured_image"),
        tags=updated_post["tags"],
        category=updated_post["category"],
        published=updated_post["published"],
        views=updated_post["views"],
        read_time=updated_post["read_time"],
        created_at=updated_post["created_at"].isoformat(),
        updated_at=updated_post["updated_at"].isoformat()
    )


@router.delete("/{slug}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    slug: str,
    current_user: TokenData = Depends(get_current_admin_user)
):
    """Delete blog post (admin only)"""
    db = get_database()
    posts_collection = db[POSTS_COLLECTION]
    
    result = await posts_collection.delete_one({"slug": slug})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    return None


@router.get("/tags/all", response_model=List[str])
async def get_all_tags():
    """Get all unique tags"""
    db = get_database()
    posts_collection = db[POSTS_COLLECTION]
    
    tags = await posts_collection.distinct("tags", {"published": True})
    return sorted(tags)


@router.get("/categories/all", response_model=List[str])
async def get_all_categories():
    """Get all unique categories"""
    db = get_database()
    posts_collection = db[POSTS_COLLECTION]
    
    categories = await posts_collection.distinct("category", {"published": True})
    return sorted(categories)

