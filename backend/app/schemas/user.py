"""User schemas"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserBase(BaseModel):
    """Base user schema"""
    username: str
    email: EmailStr


class UserUpdate(BaseModel):
    """User update schema"""
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=6)


class UserInDB(UserBase):
    """User in database schema"""
    id: str = Field(..., alias="_id")
    role: str
    created_at: str
    
    class Config:
        populate_by_name = True

