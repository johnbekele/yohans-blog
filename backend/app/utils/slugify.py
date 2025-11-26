"""Slugify utility for creating URL-friendly slugs"""
import re
from datetime import datetime


def slugify(text: str) -> str:
    """Convert text to URL-friendly slug"""
    # Convert to lowercase
    text = text.lower()
    
    # Remove special characters
    text = re.sub(r'[^\w\s-]', '', text)
    
    # Replace whitespace and multiple dashes with single dash
    text = re.sub(r'[-\s]+', '-', text)
    
    # Remove leading/trailing dashes
    text = text.strip('-')
    
    return text


def generate_unique_slug(title: str, post_id: str = None) -> str:
    """Generate unique slug with optional ID suffix"""
    slug = slugify(title)
    
    if post_id:
        # Add short ID suffix for uniqueness
        slug = f"{slug}-{post_id[:8]}"
    
    return slug


def calculate_read_time(content: str) -> int:
    """Calculate estimated reading time in minutes"""
    # Average reading speed: 200 words per minute
    words = len(content.split())
    minutes = max(1, round(words / 200))
    return minutes

