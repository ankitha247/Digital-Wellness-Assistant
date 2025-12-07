from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.password_hash import hash_password
from database import save_user, get_user_by_email

router = APIRouter(prefix="/auth", tags=["auth"])

class SignupRequest(BaseModel):
    email: str
    password: str
    name: str

@router.post("/signup")
def signup(req: SignupRequest):
    existing_user = get_user_by_email(req.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    user_data = {
        "email": req.email,
        "password_hash": hash_password(req.password),
        "name": req.name
    }

    # save_user will automatically assign an ID
    saved_user = save_user(user_data)

    return {
        "message": "Signup successful",
        "user": {
            "id": saved_user["id"],
            "email": saved_user["email"],
            "name": saved_user["name"]
        }
    }
