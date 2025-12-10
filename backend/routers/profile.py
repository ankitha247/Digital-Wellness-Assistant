# backend/routers/profile.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from database import save_profile, update_user_profile_complete

router = APIRouter(prefix="/profile", tags=["profile"])

class ProfileUpdate(BaseModel):
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

# Option 1: Accept user_id as query parameter AND body (for compatibility)
@router.post("/setup")
def setup_profile(
    user_id: int,  # ← Query parameter (from URL: ?user_id=1)
    profile_data: ProfileUpdate  # ← JSON body
):
    """
    Setup user profile.
    Usage: POST /profile/setup?user_id=1
    Body: {"bio": "Test bio", "avatar_url": "..."}
    """
    
    # Save profile data
    if profile_data.bio or profile_data.avatar_url:
        save_profile(user_id, profile_data.dict(exclude_none=True))
    
    # Mark profile as complete
    success = update_user_profile_complete(user_id, True)
    
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "success": True,
        "message": "Profile setup complete!",
        "profile_complete": True
    }

# Option 2: Alternative endpoint that accepts user_id in body
@router.post("/setup-body")
def setup_profile_body(data: dict):
    """
    Alternative: Accept user_id in body
    Usage: POST /profile/setup-body
    Body: {"user_id": 1, "bio": "Test bio"}
    """
    user_id = data.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")
    
    # Extract profile data (excluding user_id)
    profile_data = {k: v for k, v in data.items() if k != "user_id"}
    
    if profile_data:
        save_profile(user_id, profile_data)
    
    # Mark profile as complete
    success = update_user_profile_complete(user_id, True)
    
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "success": True,
        "message": "Profile setup complete!",
        "profile_complete": True
    }