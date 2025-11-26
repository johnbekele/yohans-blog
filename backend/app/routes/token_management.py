"""Token management routes for Open Arena API"""
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional
import httpx
from datetime import datetime

from ..middleware.auth_middleware import get_current_admin_user
from ..schemas.auth import TokenData
from ..database import get_database, USERS_COLLECTION

router = APIRouter()

TR_API_BASE = "https://aiopenarena.gcs.int.thomsonreuters.com"


class TokenRequest(BaseModel):
    """Token save request"""
    token: str


class TokenResponse(BaseModel):
    """Token response"""
    has_token: bool
    token_valid: Optional[bool] = None
    message: Optional[str] = None


async def validate_token(token: str) -> dict:
    """
    Validate Open Arena ESSO token by calling GET /v1/user endpoint
    
    Returns:
        dict with 'valid' (bool) and 'error' (str if invalid)
    """
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{TR_API_BASE}/v1/user",
                headers=headers
            )
            
            if response.status_code == 200:
                return {"valid": True, "data": response.json()}
            elif response.status_code == 401:
                return {"valid": False, "error": "Token is expired or invalid"}
            else:
                return {"valid": False, "error": f"Token validation failed: {response.status_code}"}
                
    except httpx.TimeoutException:
        return {"valid": False, "error": "Token validation request timed out"}
    except Exception as e:
        return {"valid": False, "error": f"Error validating token: {str(e)}"}


@router.post("/save", response_model=TokenResponse)
async def save_token(
    request: TokenRequest,
    current_user: TokenData = Depends(get_current_admin_user)
):
    """
    Save Open Arena ESSO token for the current user
    
    - Validates token first using GET /v1/user
    - Saves token to user document in database
    """
    if not request.token or not request.token.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token is required"
        )
    
    token = request.token.strip()
    
    # Validate token first
    validation_result = await validate_token(token)
    
    if not validation_result.get("valid"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=validation_result.get("error", "Token is invalid or expired")
        )
    
    # Save token to database
    db = get_database()
    users_collection = db[USERS_COLLECTION]
    
    # Update user with token and timestamp
    from bson import ObjectId
    await users_collection.update_one(
        {"_id": ObjectId(current_user.user_id)},
        {
            "$set": {
                "tr_gpt_token": token,
                "tr_gpt_token_saved_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return TokenResponse(
        has_token=True,
        token_valid=True,
        message="Token saved and validated successfully!"
    )


@router.get("/status", response_model=TokenResponse)
async def get_token_status(
    current_user: TokenData = Depends(get_current_admin_user)
):
    """
    Get token status for current user
    
    - Checks if user has a saved token
    - Validates token if it exists
    """
    db = get_database()
    users_collection = db[USERS_COLLECTION]
    
    from bson import ObjectId
    user = await users_collection.find_one({"_id": ObjectId(current_user.user_id)})
    
    if not user or not user.get("tr_gpt_token"):
        return TokenResponse(
            has_token=False,
            token_valid=False,
            message="No token saved. Please add your Open Arena ESSO token."
        )
    
    token = user.get("tr_gpt_token")
    
    # Validate the token
    validation_result = await validate_token(token)
    
    if validation_result.get("valid"):
        return TokenResponse(
            has_token=True,
            token_valid=True,
            message="Token is valid and ready to use!"
        )
    else:
        return TokenResponse(
            has_token=True,
            token_valid=False,
            message=validation_result.get("error", "Token is expired or invalid")
        )


@router.delete("/remove")
async def remove_token(
    current_user: TokenData = Depends(get_current_admin_user)
):
    """
    Remove saved token from user account
    """
    db = get_database()
    users_collection = db[USERS_COLLECTION]
    
    from bson import ObjectId
    await users_collection.update_one(
        {"_id": ObjectId(current_user.user_id)},
        {
            "$unset": {
                "tr_gpt_token": "",
                "tr_gpt_token_saved_at": ""
            },
            "$set": {
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {"message": "Token removed successfully"}

