# backend/routers/auth.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import save_user, get_user_by_email
from utils.password_hash import hash_password, verify_password
from utils.jwt_handler import create_jwt_token

router = APIRouter(prefix="/auth", tags=["auth"])

class SignupRequest(BaseModel):
    email: str
    name: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(req: SignupRequest):
    existing = get_user_by_email(req.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Save user with profile_complete set to False
    saved_user = save_user(
        {
            "email": req.email,
            "name": req.name,
            "password_hash": hash_password(req.password),
            "profile_complete": False,
        }
    )

    token = create_jwt_token(saved_user["id"])

    return {
        "id": saved_user["id"],
        "email": saved_user["email"],
        "name": saved_user["name"],
        "profile_complete": False,
        "token": token,
        "message": "User created successfully. Please complete your profile.",
    }

@router.post("/login")
def login(req: LoginRequest):
    user = get_user_by_email(req.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_jwt_token(user["id"])

    # Check if user has profile_complete field, default to True
    profile_complete = user.get("profile_complete", True)

    return {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"],
        "profile_complete": profile_complete,
        "token": token,
        "message": "Login successful",
    }