from fastapi import APIRouter, HTTPException
from models.profileu import ProfileSetupRequest
from database import save_profile, get_profile

router = APIRouter(prefix="/profile", tags=["profile"])

@router.post("/setup")
def setup_profile(req: ProfileSetupRequest):
    profile_dict = req.model_dump()
    save_profile(profile_dict)
    return {
        "message": "Profile saved successfully",
        "profile": profile_dict
    }

@router.get("/{user_id}")
def fetch_profile(user_id: int):
    profile = get_profile(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile
