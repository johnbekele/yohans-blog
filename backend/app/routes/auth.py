"""Authentication routes"""
from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime

from ..database import get_database, USERS_COLLECTION
from ..schemas.auth import UserCreate, UserLogin, Token, UserResponse, RefreshTokenRequest
from ..utils.security import get_password_hash, verify_password, create_access_token, create_refresh_token, decode_token
from ..middleware.auth_middleware import get_current_user
from ..schemas.auth import TokenData


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
    user = await users_collection.find_one({"_id": token_data.user_id})
    
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
    
    user = await users_collection.find_one({"_id": current_user.user_id})
    
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

