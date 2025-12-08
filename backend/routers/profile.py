from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from database import save_profile, get_profile, get_user_by_id

router = APIRouter(prefix="/profile", tags=["profile"])


class ProfileSetupRequest(BaseModel):
    user_id: int
    age: int
    gender: str
    weight_kg: float
    height_cm: float
    diet_type: str            # e.g., "veg", "non-veg", "vegan", "egg-veg"
    activity_level: str       # e.g., "low", "moderate", "high"
    sleep_hours: float
    health_conditions: Optional[str] = None  # simple string for now, like "migraine"
    fitness_goal: str         # e.g., "weight loss", "muscle gain", etc.


@router.post("/setup")
def setup_profile(req: ProfileSetupRequest):
    # 1) Make sure user exists
    user = get_user_by_id(req.user_id)
    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    # 2) Convert request to dict and separate user_id from profile fields
    profile_dict = req.dict()
    user_id = profile_dict.pop("user_id")

    # 3) Save profile using our database helper
    save_profile(user_id, profile_dict)

    return {
        "message": "Profile saved successfully",
        "user_id": user_id
    }


@router.get("/get/{user_id}")
def get_user_profile(user_id: int):
    """
    Optional helper to fetch and inspect the stored profile.
    """
    profile = get_profile(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return profile
