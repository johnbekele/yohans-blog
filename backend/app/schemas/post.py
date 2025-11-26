"""Blog post schemas"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class PostCreate(BaseModel):
    """Create blog post schema"""
    title: str = Field(..., min_length=3, max_length=200)
    excerpt: str = Field(..., min_length=10, max_length=500)
    content: str = Field(..., min_length=50)
    featured_image: Optional[str] = None
    tags: List[str] = []
    category: str = "general"
    published: bool = False


class PostUpdate(BaseModel):
    """Update blog post schema"""
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    excerpt: Optional[str] = Field(None, min_length=10, max_length=500)
    content: Optional[str] = Field(None, min_length=50)
    featured_image: Optional[str] = None
    tags: Optional[List[str]] = None
    category: Optional[str] = None
    published: Optional[bool] = None


class PostResponse(BaseModel):
    """Blog post response schema"""
    id: str = Field(..., alias="_id")
    title: str
    slug: str
    excerpt: str
    content: str
    author: str
    featured_image: Optional[str] = None
    tags: List[str]
    category: str
    published: bool
    views: int
    read_time: int
    created_at: str
    updated_at: str
    
    class Config:
        populate_by_name = True


class PostListItem(BaseModel):
    """Blog post list item (without full content)"""
    id: str = Field(..., alias="_id")
    title: str
    slug: str
    excerpt: str
    author: str
    featured_image: Optional[str] = None
    tags: List[str]
    category: str
    published: bool
    views: int
    read_time: int
    created_at: str
    
    class Config:
        populate_by_name = True


class PostsListResponse(BaseModel):
    """Paginated posts list response"""
    posts: List[PostListItem]
    total: int
    page: int
    page_size: int
    total_pages: int

