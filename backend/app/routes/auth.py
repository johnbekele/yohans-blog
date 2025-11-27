"""Authentication routes"""
from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Optional
from bson import ObjectId

from ..database import get_database, USERS_COLLECTION
from ..schemas.auth import UserCreate, UserLogin, Token, UserResponse, RefreshTokenRequest
from ..utils.security import (
    get_password_hash, verify_password, create_access_token, create_refresh_token, 
    decode_token, create_password_reset_token, verify_password_reset_token
)
from ..middleware.auth_middleware import get_current_user
from ..schemas.auth import TokenData
from ..services.email_service import email_service


router = APIRouter()


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """Register new user (admin only for now)"""
    db = get_database()
    users_collection = db[USERS_COLLECTION]
    
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check username
    existing_username = await users_collection.find_one({"username": user_data.username})
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create user document
    user_dict = {
        "username": user_data.username,
        "email": user_data.email,
        "password": get_password_hash(user_data.password),
        "role": user_data.role,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await users_collection.insert_one(user_dict)
    user_dict["_id"] = str(result.inserted_id)
    
    # Generate tokens
    token_data = {
        "sub": user_dict["_id"],
        "email": user_dict["email"],
        "role": user_dict["role"]
    }
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    # Prepare user response
    user_response = UserResponse(
        _id=user_dict["_id"],
        username=user_dict["username"],
        email=user_dict["email"],
        role=user_dict["role"],
        created_at=user_dict["created_at"].isoformat()
    )
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_response
    )


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """Login user"""
    db = get_database()
    users_collection = db[USERS_COLLECTION]
    
    # Find user by email
    user = await users_collection.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Generate tokens
    token_data = {
        "sub": str(user["_id"]),
        "email": user["email"],
        "role": user["role"]
    }
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    # Prepare user response
    user_response = UserResponse(
        _id=str(user["_id"]),
        username=user["username"],
        email=user["email"],
        role=user["role"],
        created_at=user["created_at"].isoformat()
    )
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_response
    )


@router.post("/refresh", response_model=Token)
async def refresh_token(request: RefreshTokenRequest):
    """Refresh access token using refresh token"""
    token_data = decode_token(request.refresh_token)
    
    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    # Get user from database
    db = get_database()
    users_collection = db[USERS_COLLECTION]
    user = await users_collection.find_one({"_id": ObjectId(token_data.user_id)})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    # Generate new tokens
    new_token_data = {
        "sub": str(user["_id"]),
        "email": user["email"],
        "role": user["role"]
    }
    access_token = create_access_token(new_token_data)
    refresh_token = create_refresh_token(new_token_data)
    
    # Prepare user response
    user_response = UserResponse(
        _id=str(user["_id"]),
        username=user["username"],
        email=user["email"],
        role=user["role"],
        created_at=user["created_at"].isoformat()
    )
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_response
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: TokenData = Depends(get_current_user)):
    """Get current user information"""
    db = get_database()
    users_collection = db[USERS_COLLECTION]
    
    user = await users_collection.find_one({"_id": ObjectId(current_user.user_id)})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        _id=str(user["_id"]),
        username=user["username"],
        email=user["email"],
        role=user["role"],
        created_at=user["created_at"].isoformat()
    )


class PasswordResetRequest(BaseModel):
    """Password reset request schema"""
    email: EmailStr


class PasswordReset(BaseModel):
    """Password reset schema"""
    token: str
    new_password: str


class ChangePassword(BaseModel):
    """Change password schema"""
    current_password: str
    new_password: str


@router.post("/logout")
async def logout(current_user: TokenData = Depends(get_current_user)):
    """Logout user (client-side token removal, this is for logging)"""
    # In a stateless JWT system, logout is handled client-side
    # This endpoint can be used for logging or future token blacklisting
    return {"message": "Logged out successfully"}


@router.post("/forgot-password")
async def forgot_password(request: PasswordResetRequest):
    """Request password reset - sends email with reset link"""
    db = get_database()
    users_collection = db[USERS_COLLECTION]
    
    # Find user by email
    user = await users_collection.find_one({"email": request.email})
    
    # Always return success to prevent email enumeration
    if not user:
        return {
            "message": "If an account with that email exists, a password reset link has been sent."
        }
    
    # Generate reset token
    reset_token = create_password_reset_token(user["email"])
    
    # Save reset token to user document (optional, for tracking)
    await users_collection.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "password_reset_token": reset_token,
                "password_reset_at": datetime.utcnow()
            }
        }
    )
    
    # Send email
    email_sent = email_service.send_password_reset_email(
        to_email=user["email"],
        reset_token=reset_token,
        username=user["username"]
    )
    
    if not email_sent:
        # Log error but don't expose email or sensitive data
        # Only log in development/debug mode
        import os
        if os.getenv("DEBUG", "False").lower() == "true":
            print(f"Failed to send password reset email")
    
    return {
        "message": "If an account with that email exists, a password reset link has been sent."
    }


@router.post("/reset-password")
async def reset_password(request: PasswordReset):
    """Reset password using reset token"""
    # Verify token
    email = verify_password_reset_token(request.token)
    
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    db = get_database()
    users_collection = db[USERS_COLLECTION]
    
    # Find user by email
    user = await users_collection.find_one({"email": email})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Validate new password
    if len(request.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long"
        )
    
    # Update password
    new_password_hash = get_password_hash(request.new_password)
    
    await users_collection.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "password": new_password_hash,
                "updated_at": datetime.utcnow()
            },
            "$unset": {
                "password_reset_token": "",
                "password_reset_at": ""
            }
        }
    )
    
    # Send confirmation email
    email_service.send_password_changed_email(
        to_email=user["email"],
        username=user["username"]
    )
    
    return {"message": "Password has been reset successfully"}


@router.post("/change-password")
async def change_password(
    request: ChangePassword,
    current_user: TokenData = Depends(get_current_user)
):
    """Change password for authenticated user"""
    db = get_database()
    users_collection = db[USERS_COLLECTION]
    
    # Find user
    user = await users_collection.find_one({"_id": ObjectId(current_user.user_id)})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Verify current password
    if not verify_password(request.current_password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Validate new password
    if len(request.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long"
        )
    
    # Check if new password is different
    if verify_password(request.new_password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from current password"
        )
    
    # Update password
    new_password_hash = get_password_hash(request.new_password)
    
    await users_collection.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "password": new_password_hash,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    # Send confirmation email
    email_service.send_password_changed_email(
        to_email=user["email"],
        username=user["username"]
    )
    
    return {"message": "Password has been changed successfully"}

